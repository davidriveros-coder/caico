"""
build_institutional_building.py

Genera de forma procedural un edificio institucional low-poly estilo
brutalista/hormigon visto, listo para usar en una web con
@react-three/fiber. Corre 100% headless dentro de Blender:

    blender --background --python build_institutional_building.py

Salidas (en la misma carpeta del script, o en --out si se especifica):
    institutional_building.glb   (mesh + materiales PBR, comprimido con Draco)
    institutional_building_preview.png  (render rapido de verificacion)

Todo el modelo se genera con bmesh + booleans, sin assets externos.
"""

import bpy
import bmesh
import random
import math
import os
import sys
from mathutils import Vector, Matrix

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------

SEED = 7
random.seed(SEED)

# Resolver carpeta de salida: soporta "blender --background --python script.py -- --out C:/ruta"
def _resolve_out_dir():
    argv = sys.argv
    if "--" in argv:
        user_args = argv[argv.index("--") + 1:]
        if "--out" in user_args:
            return user_args[user_args.index("--out") + 1]
    try:
        return os.path.dirname(os.path.abspath(__file__))
    except NameError:
        return os.getcwd()

OUT_DIR = _resolve_out_dir()
GLB_PATH = os.path.join(OUT_DIR, "institutional_building.glb")
PNG_PATH = os.path.join(OUT_DIR, "institutional_building_preview.png")

# Dimensiones generales (metros). Eje Z = altura (Blender default, Y-up al exportar a glTF).
WIDTH = 25.0     # eje X
DEPTH = 25.0     # eje Y
HEIGHT = 30.0    # eje Z

TRI_BUDGET = 30000  # tope de triangulos exigido por el pedido

# Grilla de ventanas por fachada (columnas x filas). Se perfora solo una
# fraccion de cada celda segun una probabilidad que decae de arriba-izquierda
# hacia abajo-derecha, para lograr el patron organico tipo "nube de puntos".
WINDOW_COLS = 14
WINDOW_ROWS = 16
WINDOW_FILL_RATIO = 0.55     # ocupacion relativa de la ventana dentro de su celda
WINDOW_DEPTH = 0.45          # profundidad del retranqueo de la ventana
WINDOW_MARGIN_OUT = 0.08     # cuanto sobresale el cutter hacia afuera del muro (limpieza del boolean)

# Fachadas perforadas: 'south' y 'east' densas (las que se ven de frente en
# las fotos de referencia), 'north' y 'west' mas austeras.
FACADES = {
    "south": dict(density=1.00),
    "east":  dict(density=0.85),
    "north": dict(density=0.35),
    "west":  dict(density=0.35),
}

NOTCH_SIZE = 7.0     # cuanto "muerde" cada acceso triangular a lo largo de cada arista
NOTCH_HEIGHT = 7.5   # altura del corte de acceso

SILL_PROBABILITY = 0.28  # fraccion de ventanas que reciben un cajon/sill de hormigon saliente


# ---------------------------------------------------------------------------
# UTILIDADES DE ESCENA
# ---------------------------------------------------------------------------

def clear_scene():
    """Vacia la escena y purga datablocks huerfanos para partir de cero."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def new_object_from_bmesh(bm, name):
    mesh = bpy.data.meshes.new(name + "Mesh")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def add_box_to_bmesh(bm, center, size, rotation_euler=(0, 0, 0)):
    """Agrega un box (tamano `size`=Vector, centro `center`) directo al bmesh dado."""
    mat = Matrix.Translation(center)
    if rotation_euler != (0, 0, 0):
        mat = mat @ Matrix.Rotation(rotation_euler[0], 4, "X")
        mat = mat @ Matrix.Rotation(rotation_euler[1], 4, "Y")
        mat = mat @ Matrix.Rotation(rotation_euler[2], 4, "Z")
    scale_mat = Matrix.Diagonal((size.x, size.y, size.z, 1.0))
    bmesh.ops.create_cube(bm, size=1.0, matrix=mat @ scale_mat)


def add_triangular_prism_to_bmesh(bm, tri_xy, z0, z1):
    """Agrega un prisma triangular (3 puntos XY, extruido entre z0 y z1) al bmesh."""
    (x0, y0), (x1, y1), (x2, y2) = tri_xy
    v_bottom = [bm.verts.new((x0, y0, z0)), bm.verts.new((x1, y1, z0)), bm.verts.new((x2, y2, z0))]
    v_top = [bm.verts.new((x0, y0, z1)), bm.verts.new((x1, y1, z1)), bm.verts.new((x2, y2, z1))]
    bm.faces.new(v_bottom[::-1])
    bm.faces.new(v_top)
    for i in range(3):
        j = (i + 1) % 3
        bm.faces.new((v_bottom[i], v_bottom[j], v_top[j], v_top[i]))


def apply_boolean(target_obj, cutter_obj, operation="DIFFERENCE"):
    mod = target_obj.modifiers.new(name="Bool_" + cutter_obj.name, type="BOOLEAN")
    mod.operation = operation
    mod.object = cutter_obj
    mod.solver = "EXACT"
    bpy.context.view_layer.objects.active = target_obj
    bpy.ops.object.modifier_apply(modifier=mod.name)


# ---------------------------------------------------------------------------
# MATERIALES PBR (Principled BSDF, sin texturas -> queda todo en el .glb)
# ---------------------------------------------------------------------------

def find_node(node_tree, bl_idname):
    for n in node_tree.nodes:
        if n.bl_idname == bl_idname:
            return n
    return None


def make_material(name, base_color, roughness, metallic=0.0):
    # En Blender 5.x los materiales ya son node-based por defecto (use_nodes
    # quedo deprecado); buscamos el Principled BSDF por bl_idname porque el
    # nombre visible del nodo puede variar segun idioma/build.
    mat = bpy.data.materials.new(name)
    if mat.node_tree is None:
        mat.use_nodes = True
    bsdf = find_node(mat.node_tree, "ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def add_concrete_bump(mat):
    """Variacion sutil de rugosidad con ruido procedural: no agrega poligonos,
    solo mejora el aspecto del hormigon visto en el render/web (usa Normal)."""
    nt = mat.node_tree
    bsdf = find_node(nt, "ShaderNodeBsdfPrincipled")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 18.0
    noise.inputs["Detail"].default_value = 4.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])


# ---------------------------------------------------------------------------
# VOLUMEN PRINCIPAL + ACCESOS TRIANGULARES + VENTANAS PERFORADAS
# ---------------------------------------------------------------------------

def build_main_volume():
    """Cubo solido base, origen en el centro de la base (0,0,0)."""
    bm = bmesh.new()
    add_box_to_bmesh(bm, Vector((0, 0, HEIGHT / 2)), Vector((WIDTH, DEPTH, HEIGHT)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object_from_bmesh(bm, "MainVolume")


def build_access_notches_bmesh(bm):
    """Dos cortes triangulares/diagonales que atraviesan dos esquinas de la base,
    como si el volumen flotara sobre pilotis triangulares."""
    hx, hy = WIDTH / 2, DEPTH / 2
    margin = 1.0  # sobresale para garantizar un boolean limpio
    corners = [(-hx, -hy), (hx, -hy)]  # dos esquinas de la fachada sur (frente)
    for cx, cy in corners:
        ix = -1 if cx > 0 else 1  # direccion "hacia el centro" en X
        iy = -1 if cy > 0 else 1  # direccion "hacia el centro" en Y
        outer_x = cx + (1 if cx > 0 else -1) * margin
        outer_y = cy + (1 if cy > 0 else -1) * margin
        p_corner = (outer_x, outer_y)
        p_along_x = (cx + ix * NOTCH_SIZE, outer_y)
        p_along_y = (outer_x, cy + iy * NOTCH_SIZE)
        add_triangular_prism_to_bmesh(bm, [p_corner, p_along_x, p_along_y], -1.0, NOTCH_HEIGHT)


def facade_basis(name):
    """Devuelve (origen_2D->3D, normal_hacia_afuera) para cada fachada vertical."""
    hx, hy = WIDTH / 2, DEPTH / 2
    if name == "south":  # y = -hy, normal -Y
        return (lambda u, v: Vector((u, -hy, v))), Vector((0, -1, 0))
    if name == "north":  # y = +hy, normal +Y
        return (lambda u, v: Vector((-u, hy, v))), Vector((0, 1, 0))
    if name == "east":   # x = +hx, normal +X
        return (lambda u, v: Vector((hx, u, v))), Vector((1, 0, 0))
    if name == "west":   # x = -hx, normal -X
        return (lambda u, v: Vector((-hx, -u, v))), Vector((-1, 0, 0))
    raise ValueError(name)


def window_probability(col, row, cols, rows, density):
    """Probabilidad de perforar la celda (col,row). Mas densa arriba-izquierda
    (row=0 es la fila superior), decae hacia abajo-derecha, con ruido para
    que el patron se lea organico y no como una grilla calculada."""
    fx = col / max(cols - 1, 1)
    fy = row / max(rows - 1, 1)
    falloff = 1.0 - (0.55 * fy + 0.45 * fx)
    noise = random.uniform(-0.18, 0.18)
    prob = density * (0.9 * falloff + noise)
    return max(0.0, min(0.95, prob))


NOTCH_CORNERS_XY = [(-WIDTH / 2, -DEPTH / 2), (WIDTH / 2, -DEPTH / 2)]


def _near_notch(x, y, v_bottom):
    """True si una celda cae cerca de uno de los accesos triangulares de la
    base (en planta Y en altura), para no perforar ventanas ahi."""
    if v_bottom >= NOTCH_HEIGHT + 1.5:
        return False
    for cx, cy in NOTCH_CORNERS_XY:
        if math.hypot(x - cx, y - cy) < NOTCH_SIZE + 1.5:
            return True
    return False


def build_windows_for_facade(facade_name, cfg, window_records):
    """Genera el cutter de ventanas de UNA sola fachada (bmesh propio, no
    compartido entre fachadas). Cada fachada se boolean-ea por separado contra
    el volumen principal: mantener los cutters de una misma fachada aislados
    evita que el solver 'EXACT' reciba cajas que se tocan/solapan cerca de las
    esquinas (eso es lo que generaba geometria basura dispersa por el mundo
    cuando se hacia un unico boolean con todos los cutters juntos)."""
    cell_w = WIDTH / WINDOW_COLS
    cell_h = HEIGHT / WINDOW_ROWS
    win_w = cell_w * WINDOW_FILL_RATIO
    win_h = cell_h * WINDOW_FILL_RATIO

    to_world, normal = facade_basis(facade_name)
    span = WIDTH if facade_name in ("south", "north") else DEPTH
    n_cols = int(round(span / cell_w))
    n_rows = WINDOW_ROWS

    bm = bmesh.new()
    any_window = False

    for row in range(n_rows):
        # se excluye la columna exterior (0 y n_cols-1): ahi es donde esta
        # fachada linda con la perpendicular, y sus cutters podrian solaparse
        # en la arista compartida.
        for col in range(1, n_cols - 1):
            prob = window_probability(col, row, n_cols, n_rows, cfg["density"])
            if random.random() >= prob:
                continue

            v_bottom = row * cell_h
            u = -span / 2 + cell_w * (col + 0.5)
            v = HEIGHT - cell_h * (row + 0.5)  # row 0 = arriba
            center_face = to_world(u, v)

            if _near_notch(center_face.x, center_face.y, v_bottom):
                continue

            cutter_center = center_face - normal * (WINDOW_DEPTH / 2 - WINDOW_MARGIN_OUT)
            if facade_name in ("south", "north"):
                size = Vector((win_w, WINDOW_DEPTH + WINDOW_MARGIN_OUT * 2, win_h))
            else:
                size = Vector((WINDOW_DEPTH + WINDOW_MARGIN_OUT * 2, win_w, win_h))
            add_box_to_bmesh(bm, cutter_center, size)
            any_window = True

            glass_point = center_face - normal * WINDOW_DEPTH
            window_records.append(dict(point=glass_point, normal=normal))

            if random.random() < SILL_PROBABILITY:
                build_sill(facade_name, to_world, normal, u, v_bottom + cell_h * 0.02, win_w)

    if not any_window:
        bm.free()
        return None
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object_from_bmesh(bm, f"WindowCutter_{facade_name}")


SILL_OBJECTS = []


def build_sill(facade_name, to_world, normal, u, v_bottom, win_w):
    """Cajon de hormigon saliente bajo algunas ventanas (detalle de las fotos)."""
    sill_depth = 0.45
    sill_h = 0.3
    face_pt = to_world(u, v_bottom)
    center = face_pt + normal * (sill_depth / 2 - 0.05) + Vector((0, 0, sill_h / 2))
    if facade_name in ("south", "north"):
        size = Vector((win_w * 1.15, sill_depth, sill_h))
    else:
        size = Vector((sill_depth, win_w * 1.15, sill_h))
    bm = bmesh.new()
    add_box_to_bmesh(bm, center, size)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    obj = new_object_from_bmesh(bm, "Sill")
    SILL_OBJECTS.append(obj)


def recolor_window_faces(main_obj, window_records, window_slot_index):
    """Despues del boolean, busca la cara mas cercana a cada 'fondo de ventana'
    esperado y la reasigna al material de vidrio (slot 1)."""
    bm = bmesh.new()
    bm.from_mesh(main_obj.data)
    bm.faces.ensure_lookup_table()

    for rec in window_records:
        target_point = rec["point"]
        target_normal = rec["normal"]
        best_face = None
        best_dist = 1e9
        for f in bm.faces:
            if f.normal.dot(target_normal) < 0.9:
                continue
            d = (f.calc_center_median() - target_point).length
            if d < best_dist:
                best_dist = d
                best_face = f
        if best_face is not None and best_dist < 0.6:
            best_face.material_index = window_slot_index

    bm.to_mesh(main_obj.data)
    bm.free()


# ---------------------------------------------------------------------------
# TECHO: BARANDA PERIMETRAL + VEGETACION
# ---------------------------------------------------------------------------

def build_roof_parapet():
    hx, hy = WIDTH / 2, DEPTH / 2
    rail_h = 1.1
    z = HEIGHT + rail_h / 2
    thickness = 0.12
    bm = bmesh.new()
    # 4 tramos de baranda (norte/sur horizontales, este/oeste incluyen esquinas)
    add_box_to_bmesh(bm, Vector((0, -hy, z)), Vector((WIDTH, thickness, rail_h)))
    add_box_to_bmesh(bm, Vector((0, hy, z)), Vector((WIDTH, thickness, rail_h)))
    add_box_to_bmesh(bm, Vector((-hx, 0, z)), Vector((thickness, DEPTH, rail_h)))
    add_box_to_bmesh(bm, Vector((hx, 0, z)), Vector((thickness, DEPTH, rail_h)))
    # postes cada 2.5m en todo el perimetro
    post_h = rail_h
    spacing = 2.5
    for x in [-hx + i * spacing for i in range(int(WIDTH / spacing) + 1)]:
        add_box_to_bmesh(bm, Vector((x, -hy, HEIGHT + post_h / 2)), Vector((0.08, 0.08, post_h)))
        add_box_to_bmesh(bm, Vector((x, hy, HEIGHT + post_h / 2)), Vector((0.08, 0.08, post_h)))
    for y in [-hy + i * spacing for i in range(int(DEPTH / spacing) + 1)]:
        add_box_to_bmesh(bm, Vector((-hx, y, HEIGHT + post_h / 2)), Vector((0.08, 0.08, post_h)))
        add_box_to_bmesh(bm, Vector((hx, y, HEIGHT + post_h / 2)), Vector((0.08, 0.08, post_h)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object_from_bmesh(bm, "RoofParapet")


def build_rooftop_trees(count=5):
    hx, hy = WIDTH / 2, DEPTH / 2
    bm = bmesh.new()
    for _ in range(count):
        # concentrados cerca de una esquina, como en las fotos de referencia
        x = random.uniform(-hx + 2, -hx + 9)
        y = random.uniform(hy - 9, hy - 2)
        trunk_h = random.uniform(1.4, 2.2)
        foliage_r = random.uniform(1.0, 1.6)

        mat_trunk = Matrix.Translation(Vector((x, y, HEIGHT + trunk_h / 2)))
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6,
                               radius1=0.12, radius2=0.12, depth=trunk_h,
                               matrix=mat_trunk)

        mat_foliage = Matrix.Translation(Vector((x, y, HEIGHT + trunk_h + foliage_r * 0.6)))
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=7,
                               radius1=foliage_r, radius2=0.0, depth=foliage_r * 1.4,
                               matrix=mat_foliage)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_object_from_bmesh(bm, "RooftopTrees")


# ---------------------------------------------------------------------------
# CAMARA, LUCES Y RENDER DE PREVIEW
# ---------------------------------------------------------------------------

def look_at(obj, target):
    direction = (target - obj.location).normalized()
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def world_bbox(obj):
    coords = [obj.matrix_world @ v.co for v in obj.data.vertices]
    xs, ys, zs = [c.x for c in coords], [c.y for c in coords], [c.z for c in coords]
    return Vector((min(xs), min(ys), min(zs))), Vector((max(xs), max(ys), max(zs)))


def setup_camera_and_lights(building_obj):
    # Encuadre automatico segun el bounding box real del edificio (incluye el
    # volumen secundario y la escalera, que sobresalen del cubo principal), en
    # vez de coordenadas fijas: evita que la camara quede "al ras" del techo
    # y vea la baranda de canto (que se leeria como cajas flotando sueltas).
    bmin, bmax = world_bbox(building_obj)
    center = (bmin + bmax) / 2
    radius = (bmax - bmin).length / 2

    cam_data = bpy.data.cameras.new("PreviewCamera")
    cam_data.lens = 28  # angular ancho: asegura que todo el edificio entre en cuadro
    cam_obj = bpy.data.objects.new("PreviewCamera", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    # Direccion elegida para mostrar la fachada sur (accesos triangulares) y la
    # este (mas densa en ventanas) en el mismo cuadro.
    cam_dir = Vector((1.3, -1.3, 0.75)).normalized()
    cam_obj.location = center + cam_dir * radius * 2.8
    look_at(cam_obj, center)
    bpy.context.scene.camera = cam_obj

    def add_sun(name, direction_vec, energy, color=(1.0, 1.0, 1.0)):
        light_data = bpy.data.lights.new(name, type="SUN")
        light_data.energy = energy
        light_data.color = color
        light_data.angle = math.radians(2.0)
        obj = bpy.data.objects.new(name, light_data)
        bpy.context.collection.objects.link(obj)
        obj.location = center + direction_vec.normalized() * radius * 3
        look_at(obj, center)
        return obj

    add_sun("KeyLight", Vector((0.6, -1.0, 1.3)), 3.2, (1.0, 0.97, 0.9))
    add_sun("FillLight", Vector((-1.2, -0.2, 0.6)), 0.9, (0.85, 0.9, 1.0))
    add_sun("RimLight", Vector((-0.3, 1.1, 0.8)), 1.6, (1.0, 1.0, 1.0))

    world = bpy.data.worlds.new("World")
    if world.node_tree is None:
        world.use_nodes = True
    bg = find_node(world.node_tree, "ShaderNodeBackground")
    bg.inputs[0].default_value = (0.55, 0.62, 0.7, 1.0)
    bg.inputs[1].default_value = 1.0
    bpy.context.scene.world = world


def render_preview():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1200
    scene.render.filepath = PNG_PATH
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"
    scene.eevee.taa_render_samples = 64
    bpy.ops.render.render(write_still=True)
    print(f"Preview PNG guardado en: {PNG_PATH}")


# ---------------------------------------------------------------------------
# EXPORT GLB (Draco)
# ---------------------------------------------------------------------------

def export_glb():
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
    )
    print(f"GLB exportado en: {GLB_PATH}")


# ---------------------------------------------------------------------------
# CONTEO DE TRIANGULOS / SAFETY NET
# ---------------------------------------------------------------------------

def count_triangles(obj):
    return sum(max(len(p.vertices) - 2, 1) for p in obj.data.polygons)


def enforce_tri_budget(obj, budget):
    tris = count_triangles(obj)
    print(f"Triangulos antes de safety-check: {tris}")
    if tris > budget:
        ratio = budget / tris
        mod = obj.modifiers.new("SafetyDecimate", "DECIMATE")
        mod.ratio = max(ratio, 0.1)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
        tris = count_triangles(obj)
        print(f"Decimate aplicado -> triangulos finales: {tris}")
    else:
        print("Dentro del presupuesto, no hace falta decimar.")
    return tris


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    clear_scene()
    SILL_OBJECTS.clear()  # por si main() se corre mas de una vez en la misma sesion

    mat_concrete = make_material("Concrete", (0.72, 0.70, 0.66), 0.85, metallic=0.0)
    add_concrete_bump(mat_concrete)
    mat_window = make_material("WindowGlass", (0.04, 0.05, 0.07), 0.18, metallic=0.15)
    mat_metal = make_material("Metal", (0.55, 0.55, 0.58), 0.4, metallic=0.85)
    mat_vegetation = make_material("Vegetation", (0.20, 0.35, 0.16), 0.8, metallic=0.0)

    # --- Volumen principal ---
    main_obj = build_main_volume()
    main_obj.data.materials.append(mat_concrete)   # slot 0
    main_obj.data.materials.append(mat_window)      # slot 1

    # --- Accesos triangulares: boolean propio (aislado de las ventanas) ---
    notch_bm = bmesh.new()
    build_access_notches_bmesh(notch_bm)
    bmesh.ops.recalc_face_normals(notch_bm, faces=notch_bm.faces)
    notch_obj = new_object_from_bmesh(notch_bm, "NotchCutters")
    apply_boolean(main_obj, notch_obj, operation="DIFFERENCE")
    bpy.data.objects.remove(notch_obj, do_unlink=True)

    # --- Ventanas: un boolean por fachada (evita cutters que se tocan entre
    # fachadas distintas, que confundian al solver EXACT) ---
    window_records = []
    for facade_name, cfg in FACADES.items():
        cutter_obj = build_windows_for_facade(facade_name, cfg, window_records)
        if cutter_obj is None:
            continue
        apply_boolean(main_obj, cutter_obj, operation="DIFFERENCE")
        bpy.data.objects.remove(cutter_obj, do_unlink=True)

    recolor_window_faces(main_obj, window_records, window_slot_index=1)

    # --- Techo: baranda + vegetacion ---
    parapet_obj = build_roof_parapet()
    parapet_obj.data.materials.append(mat_metal)
    trees_obj = build_rooftop_trees()
    trees_obj.data.materials.append(mat_vegetation)

    # --- Sills (generados durante build_windows) ---
    for sill in SILL_OBJECTS:
        sill.data.materials.append(mat_concrete)

    # --- Join final: un solo objeto, origen en la base ---
    bpy.ops.object.select_all(action="DESELECT")
    all_parts = [main_obj, parapet_obj, trees_obj] + SILL_OBJECTS
    for obj in all_parts:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = main_obj
    bpy.ops.object.join()

    building_obj = main_obj
    building_obj.name = "InstitutionalBuilding"

    # Origen exactamente en el centro de la base (0,0,0): la geometria ya fue
    # construida ahi, esto solo confirma que el object-origin coincide.
    bpy.context.scene.cursor.location = (0, 0, 0)
    bpy.context.view_layer.objects.active = building_obj
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")

    enforce_tri_budget(building_obj, TRI_BUDGET)

    setup_camera_and_lights(building_obj)
    render_preview()
    export_glb()

    print("Listo.")


if __name__ == "__main__":
    main()
