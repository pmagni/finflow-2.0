# FinFlow 2.0

Aplicación web de bienestar financiero (React, Vite, TypeScript, Tailwind) con backend en **Supabase** (Auth + PostgreSQL + Edge Functions). Diseñada para usuarios que prefieren entrada manual y privacidad, alineada con el PRD en `documentation/FinFlow_PRD.txt`.

## Requisitos

- Node.js 20+
- Cuenta [Supabase](https://supabase.com) con proyecto vinculado
- (Opcional) [n8n](https://n8n.io) para recordatorios y automatizaciones

## Variables de entorno

Crea `.env` en la raíz (Vite expone solo prefijos permitidos; revisa `src/config/env.ts` y `src/services/supabase.ts`):

| Variable | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima (pública) |

**Edge Functions** (panel Supabase → Edge Functions → Secrets):

| Secreto | Uso |
|---------|-----|
| `OPENAI_API_KEY` | Asistente IA (`get-financial-advise`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo en servidor (p. ej. invitaciones); nunca en el frontend |

## Base de datos

Aplica migraciones en orden desde `supabase/migrations/` (CLI Supabase o SQL Editor), incluyendo:

- Columnas PRD para deudas, presupuesto y planes de pago
- Política RLS de `gamification_events` (inserción solo del propio usuario)
- Seed de módulos de educación (`education_modules`)

## Comandos

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
npm run test     # Vitest
npm run lint     # ESLint
```

## Despliegue

- **Frontend**: Vercel o Netlify; define `VITE_SUPABASE_*` en el panel del proveedor.
- **Backend**: Supabase (Auth, DB, Storage si lo usas, Edge Functions desplegadas con `supabase functions deploy`).

## n8n (recordatorios / alertas)

El PRD menciona n8n para correos y recordatorios. No está acoplado al repo: configura flujos que:

1. lean la API de Supabase (tablas `budgets`, `savings_goals`, etc.) con un rol limitado o webhooks, o
2. reciban webhooks desde Edge Functions cuando implementes notificaciones.

Documenta URLs y claves solo en tu instancia n8n o gestor de secretos.

## Estructura relevante

- `src/pages/` — pantallas (deudas, presupuesto, ahorros, chat IA, retos, educación, organizaciones, transacciones)
- `src/services/api/` — clientes Supabase
- `supabase/functions/` — IA y utilidades invitación

## Licencia

Ver `LICENSE`.
