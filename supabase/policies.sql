-- ============================================================
-- CAICO UDP — Row Level Security
-- Ejecutar después de schema.sql
--
-- Reglas generales:
--   - Lectura (select): pública en todas las tablas (ranking, comentarios,
--     sugerencias y calendario son visibles para cualquiera).
--   - Escritura (insert/update): solo el propio usuario autenticado sobre sus
--     propias filas (auth.uid() = usuario_id).
--   - fechas_academicas: solo lectura pública; la escritura la hace el CAICO
--     directo desde el dashboard de Supabase (no hay formulario en el frontend).
-- ============================================================

alter table perfiles enable row level security;
alter table profesores enable row level security;
alter table evaluaciones_profesores enable row level security;
alter table sugerencias_marca enable row level security;
alter table votos_sugerencia enable row level security;
alter table encuesta_satisfaccion enable row level security;
alter table fechas_academicas enable row level security;

-- ---------- perfiles ----------
create policy "perfiles: lectura publica" on perfiles
  for select using (true);

create policy "perfiles: crear su propio perfil" on perfiles
  for insert with check (auth.uid() = id);

create policy "perfiles: editar su propio perfil" on perfiles
  for update using (auth.uid() = id);

-- ---------- profesores ----------
-- Catálogo de solo lectura pública; se puebla desde el dashboard de Supabase.
create policy "profesores: lectura publica" on profesores
  for select using (true);

-- ---------- evaluaciones_profesores ----------
create policy "evaluaciones: lectura publica" on evaluaciones_profesores
  for select using (true);

create policy "evaluaciones: crear las propias" on evaluaciones_profesores
  for insert with check (auth.uid() = usuario_id);

create policy "evaluaciones: editar las propias" on evaluaciones_profesores
  for update using (auth.uid() = usuario_id);

-- ---------- sugerencias_marca ----------
create policy "sugerencias: lectura publica" on sugerencias_marca
  for select using (true);

create policy "sugerencias: crear las propias" on sugerencias_marca
  for insert with check (auth.uid() = usuario_id);

create policy "sugerencias: editar las propias" on sugerencias_marca
  for update using (auth.uid() = usuario_id);

-- ---------- votos_sugerencia ----------
create policy "votos: lectura publica" on votos_sugerencia
  for select using (true);

create policy "votos: crear los propios" on votos_sugerencia
  for insert with check (auth.uid() = usuario_id);

-- ---------- encuesta_satisfaccion ----------
create policy "encuesta: lectura publica" on encuesta_satisfaccion
  for select using (true);

create policy "encuesta: crear la propia" on encuesta_satisfaccion
  for insert with check (auth.uid() = usuario_id);

create policy "encuesta: editar la propia" on encuesta_satisfaccion
  for update using (auth.uid() = usuario_id);

-- ---------- fechas_academicas ----------
-- Solo lectura pública. La escritura se hace manualmente desde el dashboard
-- (con el rol de servicio, que no pasa por RLS), por lo que no se crea policy de insert/update.
create policy "fechas: lectura publica" on fechas_academicas
  for select using (true);

-- Las vistas ranking_profesores y sugerencias_con_votos heredan el RLS de sus
-- tablas base; no necesitan policies propias.
