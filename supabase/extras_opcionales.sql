-- ============================================================
-- CAICO UDP — Mejoras opcionales al esquema base
-- Nada de este archivo es obligatorio. El frontend funciona sin él,
-- pero soluciona dos fricciones reales si decides ejecutarlo.
-- ============================================================

-- 1) Auto-crear la fila de `perfiles` cuando alguien se identifica por magic link.
--    Sin esto, el frontend hace un `upsert` a `perfiles` manualmente apenas detecta
--    sesión activa (ver src/hooks/useSesionEstudiante.js), lo cual funciona igual,
--    pero un trigger en la base de datos es más robusto (cubre cualquier otro
--    cliente que use Supabase Auth a futuro, no solo esta web).
create or replace function public.manejar_nuevo_usuario()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre, correo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.manejar_nuevo_usuario();

-- 2) Índice para acelerar "¿qué sugerencias hizo este usuario?" a medida que crezca la tabla.
create index if not exists idx_sugerencias_marca_usuario on sugerencias_marca (usuario_id);

-- 3) Índice para acelerar "¿qué votó este usuario?" (usado por el frontend para
--    saber qué botones de voto deshabilitar).
create index if not exists idx_votos_sugerencia_usuario on votos_sugerencia (usuario_id);
