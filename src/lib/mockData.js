// Datos de ejemplo usados solo cuando no hay un proyecto Supabase configurado (ver supabaseClient.js).
// Permiten ver la web funcionando de punta a punta mientras se conecta la base de datos real.

export const profesoresMock = [
  { id: 'p1', nombre: 'María José Contreras', ramo: 'Microeconomía I' },
  { id: 'p2', nombre: 'Rodrigo Salinas', ramo: 'Contabilidad Financiera' },
  { id: 'p3', nombre: 'Francisca Uribe', ramo: 'Marketing Estratégico' },
  { id: 'p4', nombre: 'Ignacio Bravo', ramo: 'Finanzas Corporativas' },
  { id: 'p5', nombre: 'Camila Reyes', ramo: 'Comportamiento Organizacional' },
]

export const evaluacionesMock = [
  { id: 'e1', profesor_id: 'p1', usuario_id: 'u1', puntaje: 5, comentario: 'Explica súper claro y responde dudas por correo altiro.', reportado: false, created_at: '2026-05-10T12:00:00Z' },
  { id: 'e2', profesor_id: 'p1', usuario_id: 'u2', puntaje: 4, comentario: 'Buenas ayudantías, exige harto pero se aprende.', reportado: false, created_at: '2026-06-02T12:00:00Z' },
  { id: 'e3', profesor_id: 'p2', usuario_id: 'u3', puntaje: 3, comentario: 'Ritmo rápido, conviene ir al día con las lecturas.', reportado: false, created_at: '2026-04-20T12:00:00Z' },
  { id: 'e4', profesor_id: 'p3', usuario_id: 'u1', puntaje: 5, comentario: 'Clases muy dinámicas, casos reales de marcas chilenas.', reportado: false, created_at: '2026-06-15T12:00:00Z' },
  { id: 'e5', profesor_id: 'p4', usuario_id: 'u2', puntaje: 4, comentario: 'Corrige rápido y da buen feedback en los controles.', reportado: false, created_at: '2026-03-11T12:00:00Z' },
]

export const sugerenciasMarcaMock = [
  { id: 's1', usuario_id: 'u1', nombre_marca: 'Not Company (NotCo)', descripcion: 'Activación con degustación de productos plant-based en el patio central.', total_votos: 12, created_at: '2026-06-01T12:00:00Z' },
  { id: 's2', usuario_id: 'u2', nombre_marca: 'Banco Estado', descripcion: 'Charla de educación financiera + stand de cuentas para primer empleo.', total_votos: 8, created_at: '2026-06-05T12:00:00Z' },
  { id: 's3', usuario_id: 'u3', nombre_marca: 'Red Bull', descripcion: 'Activación energizante en semana de pruebas.', total_votos: 15, created_at: '2026-05-20T12:00:00Z' },
]

export const encuestaSatisfaccionMock = [
  { mes: '2026-02-01', promedio: 3.6 },
  { mes: '2026-03-01', promedio: 3.8 },
  { mes: '2026-04-01', promedio: 3.4 },
  { mes: '2026-05-01', promedio: 4.1 },
  { mes: '2026-06-01', promedio: 4.3 },
]

// Placeholder: reemplazar con las fechas reales del calendario académico UDP.
export const fechasAcademicasMock = [
  { id: 'f1', titulo: 'Inicio semestre', descripcion: 'Comienzo del segundo semestre académico.', fecha_inicio: '2026-08-03', fecha_fin: null, tipo: 'evento' },
  { id: 'f2', titulo: 'Semana de pruebas 1', descripcion: 'Primera semana de pruebas parciales.', fecha_inicio: '2026-09-14', fecha_fin: '2026-09-18', tipo: 'prueba' },
  { id: 'f3', titulo: 'Feriado Fiestas Patrias', descripcion: 'Sin actividades académicas.', fecha_inicio: '2026-09-18', fecha_fin: '2026-09-19', tipo: 'feriado' },
  { id: 'f4', titulo: 'Inscripción de ramos', descripcion: 'Período de inscripción para el semestre siguiente.', fecha_inicio: '2026-11-02', fecha_fin: '2026-11-13', tipo: 'inscripcion' },
  { id: 'f5', titulo: 'Semana de pruebas 2', descripcion: 'Segunda semana de pruebas parciales.', fecha_inicio: '2026-11-16', fecha_fin: '2026-11-20', tipo: 'prueba' },
]

// Placeholder: reemplazar por los logos reales de las marcas colaboradoras.
export const marcasColaboradorasMock = [
  { id: 'm1', nombre: 'Marca colaboradora 1' },
  { id: 'm2', nombre: 'Marca colaboradora 2' },
  { id: 'm3', nombre: 'Marca colaboradora 3' },
  { id: 'm4', nombre: 'Marca colaboradora 4' },
]

// Placeholder: reemplazar por el equipo real del CAICO (nombre, cargo y foto).
export const equipoCaicoMock = [
  { id: 'i1', nombre: 'Nombre Apellido', cargo: 'Presidencia' },
  { id: 'i2', nombre: 'Nombre Apellido', cargo: 'Vicepresidencia' },
  { id: 'i3', nombre: 'Nombre Apellido', cargo: 'Secretaría General' },
  { id: 'i4', nombre: 'Nombre Apellido', cargo: 'Tesorería' },
  { id: 'i5', nombre: 'Nombre Apellido', cargo: 'Eje Salud Mental' },
  { id: 'i6', nombre: 'Nombre Apellido', cargo: 'Eje Productividad' },
  { id: 'i7', nombre: 'Nombre Apellido', cargo: 'Eje Activaciones' },
  { id: 'i8', nombre: 'Nombre Apellido', cargo: 'Eje Carrera' },
]
