# Edificio institucional low-poly (Blender bpy -> glTF/GLB)

## Archivos

- `build_institutional_building.py` — script completo, corre standalone en Blender.
- `institutional_building.glb` — modelo final (mesh + PBR + Draco), ~22 KB.
- `institutional_building_preview.png` — render de verificacion (EEVEE, 1600x1200).

## Como correrlo

### Si ya tenes Blender instalado

Windows (PowerShell / cmd), con Blender en el PATH o usando la ruta completa:

```
"C:\Program Files\Blender Foundation\Blender 5.1\blender.exe" --background --python build_institutional_building.py
```

Mac / Linux:

```
blender --background --python build_institutional_building.py
```

Esto genera `institutional_building.glb` e `institutional_building_preview.png` en la
misma carpeta del script. Para elegir otra carpeta de salida:

```
blender --background --python build_institutional_building.py -- --out "C:/ruta/de/salida"
```

### Si no tenes Blender instalado

1. Descargalo gratis desde https://www.blender.org/download/ (no requiere licencia).
   - Windows: instalador `.msi` o version portable `.zip` (no hace falta instalar,
     alcanza con descomprimir y ejecutar `blender.exe`).
   - `winget install BlenderFoundation.Blender` tambien funciona en Windows 10/11.
2. Una vez descomprimido/instalado, corre el comando de arriba apuntando a ese
   `blender.exe`.

No hace falta abrir la interfaz grafica de Blender en ningun momento: todo el
proceso (modelado, materiales, render y export) corre en modo `--background`.

## Que genera el script

- Volumen principal de 25x25x30 m en hormigon visto.
- Dos accesos triangulares en la base (pilotis), cortados con boolean.
- Ventanas cuadradas perforadas de forma procedural por fachada, con
  probabilidad decreciente (mas densas arriba-izquierda), mas cajones de
  hormigon salientes (sills) bajo algunas de ellas.
- Volumen secundario retranqueado con escalera metalica exterior en zigzag
  (4 tramos, barandas y descansos).
- Baranda perimetral en el techo + arboles low-poly.
- Materiales PBR simples (Principled BSDF): hormigon, vidrio, metal, vegetacion.
- Origen del objeto en el centro de la base -> listo para posicionar en
  Three.js/@react-three/fiber con `position={[0, 0, 0]}` parado sobre el piso.
- Export GLB con compresion Draco (mesh de ~5.4k triangulos, muy por debajo
  del limite de 30k pedido).

## Uso en @react-three/fiber

```jsx
import { useGLTF } from '@react-three/drei'

function Building() {
  const { scene } = useGLTF('/institutional_building.glb')
  return <primitive object={scene} />
}
useGLTF.preload('/institutional_building.glb')
```

Como el GLB usa compresion Draco, asegurate de que `useGLTF`/`GLTFLoader` tenga
configurado el `DRACOLoader` (drei lo hace automaticamente; con three.js "a
mano" hay que setear `dracoLoader.setDecoderPath(...)`).

## Parametros ajustables (arriba del script)

`WIDTH`, `DEPTH`, `HEIGHT`, `WINDOW_COLS/ROWS`, `WINDOW_FILL_RATIO`,
`FACADES` (densidad de ventanas por cara), `NOTCH_SIZE/HEIGHT`,
`SILL_PROBABILITY`, `TRI_BUDGET`. Cambiar `SEED` genera una variante distinta
del patron de ventanas/sills/arboles.
