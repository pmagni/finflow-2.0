-- Seed starter education modules (idempotent)
insert into public.education_modules (id, title, description, content, difficulty_level, category, estimated_duration_minutes, is_active)
values
(
  '11111111-1111-4111-8111-111111111101',
  '¿Qué es un presupuesto?',
  'Aprende los fundamentos de la planificación financiera.',
  '{"sections":[{"heading":"Idea clave","body":"Un presupuesto lista tus ingresos y decide cómo asignar cada peso a gastos, deudas, ahorro y ocio antes de que pase el mes."},{"heading":"Por dónde empezar","body":"Suma ingresos netos, clasifica gastos fijos vs variables, y deja un monto explícito para ahorro — aunque sea pequeño."}]}'::jsonb,
  'beginner',
  'Fundamentos',
  5,
  true
),
(
  '11111111-1111-4111-8111-111111111102',
  'La regla 50/30/20',
  'Distribuye ingresos entre necesidades, deseos y ahorro.',
  '{"sections":[{"heading":"Qué significa","body":"Aproximadamente 50% necesidades básicas, 30% estilo de vida y 20% ahorro y extra pago de deuda. Es una guía, no una ley."},{"heading":"En la práctica","body":"Si vives en ciudad cara, quizá necesites 55/25/20. Lo importante es que el ahorro y el pago a deudas no queden “al final del mes”."}]}'::jsonb,
  'beginner',
  'Presupuesto',
  8,
  true
),
(
  '11111111-1111-4111-8111-111111111103',
  'Estrategias de pago de deudas',
  'Bola de nieve vs avalancha.',
  '{"sections":[{"heading":"Avalancha","body":"Pagas primero la deuda con **mayor tasa de interés**. Ahorras más en intereses totales."},{"heading":"Bola de nieve","body":"Pagas primero la deuda con **menor balance** para ganar impulso psicológico al cerrar cuentas más rápido."}]}'::jsonb,
  'intermediate',
  'Deudas',
  10,
  true
),
(
  '11111111-1111-4111-8111-111111111104',
  'Fondo de emergencia',
  'Por qué y cuánto ahorrar.',
  '{"sections":[{"heading":"Para qué sirve","body":"Cubre imprevistos (salud, trabajo, hogar) sin usar tarjeta al límite."},{"heading":"Monto inicial","body":"Muchas personas empiezan con 1 mes de gastos esenciales y escalan a 3–6 meses según estabilidad de ingresos."}]}'::jsonb,
  'beginner',
  'Ahorro',
  7,
  true
)
on conflict (id) do nothing;
