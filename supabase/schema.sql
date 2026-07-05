-- ============================================================
-- CAICO UDP — Esquema base de datos (Supabase / Postgres)
-- Ejecutar en el SQL Editor del proyecto Supabase, en este orden:
--   1. schema.sql   (este archivo: tablas + vistas)
--   2. policies.sql (Row Level Security)
--   3. extras_opcionales.sql (mejoras sugeridas, opcional)
-- ============================================================

-- Perfil simple del estudiante (vinculado a auth.users de Supabase Auth)
create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  correo text not null,
  created_at timestamptz default now()
);

-- Catálogo de profesores
create table profesores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ramo text,               -- ramo/curso que dicta, opcional
  created_at timestamptz default now()
);

-- Evaluaciones de profesores (ranking + comentario)
create table evaluaciones_profesores (
  id uuid primary key default gen_random_uuid(),
  profesor_id uuid references profesores(id) on delete cascade,
  usuario_id uuid references perfiles(id) on delete cascade,
  puntaje int not null check (puntaje between 1 and 5),
  comentario text,
  reportado boolean default false,
  created_at timestamptz default now(),
  unique (profesor_id, usuario_id) -- un estudiante evalúa a un profesor una sola vez (puede editar su fila después)
);

-- Sugerencias de marcas para activaciones
create table sugerencias_marca (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references perfiles(id) on delete cascade,
  nombre_marca text not null,
  descripcion text,
  created_at timestamptz default now()
);

-- Votos ("me gusta esta idea") a las sugerencias de marca
create table votos_sugerencia (
  id uuid primary key default gen_random_uuid(),
  sugerencia_id uuid references sugerencias_marca(id) on delete cascade,
  usuario_id uuid references perfiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (sugerencia_id, usuario_id) -- evita votar dos veces la misma idea
);

-- Encuesta de satisfacción mensual (vida universitaria)
create table encuesta_satisfaccion (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references perfiles(id) on delete cascade,
  mes date not null,        -- guardar siempre como primer día del mes, ej: 2026-07-01
  puntaje int not null check (puntaje between 1 and 5),
  created_at timestamptz default now(),
  unique (usuario_id, mes)  -- una sola respuesta por persona por mes
);

-- Fechas importantes / calendario académico (editable por el CAICO)
create table fechas_academicas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha_inicio date not null,
  fecha_fin date,
  tipo text,   -- ej: 'prueba', 'feriado', 'inscripcion', 'evento'
  created_at timestamptz default now()
);

-- Vistas útiles: evitan calcular promedios/conteos en el frontend

-- Promedio y cantidad de evaluaciones por profesor
create view ranking_profesores as
select
  p.id,
  p.nombre,
  p.ramo,
  coalesce(avg(e.puntaje), 0) as promedio,
  count(e.id) as total_evaluaciones
from profesores p
left join evaluaciones_profesores e on e.profesor_id = p.id and e.reportado = false
group by p.id;

-- Conteo de votos por sugerencia de marca
create view sugerencias_con_votos as
select
  s.id,
  s.usuario_id,
  s.nombre_marca,
  s.descripcion,
  s.created_at,
  count(v.id) as total_votos
from sugerencias_marca s
left join votos_sugerencia v on v.sugerencia_id = s.id
group by s.id;
