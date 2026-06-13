# Fase 4 — PWA & Pulido · Guía de implementación

## Archivos entregados

```
├── next.config.ts                          # Config Next.js + serwist
├── vercel.json                             # Cron jobs de notificaciones
├── package.json                            # Dependencias fase 4
├── .env.example                            # Variables de entorno
│
├── public/
│   ├── manifest.json                       # Manifest PWA
│   └── icons/                             # (generar con script)
│
├── app/
│   ├── layout.tsx                          # Root layout con metadata PWA
│   ├── globals.css                         # Design tokens + dark mode
│   ├── sw.ts                              # Service worker (serwist)
│   └── offline/
│       └── page.tsx                        # Fallback sin conexión
│
├── app/api/push/
│   ├── subscribe/route.ts                  # POST/DELETE suscripción
│   ├── send/route.ts                       # POST envío manual
│   └── cron/route.ts                       # GET cron de recordatorios
│
├── components/push/
│   ├── ServiceWorkerRegistrar.tsx          # Registra SW en cliente
│   └── PushNotificationManager.tsx        # Banner opt-in + toggle settings
│
├── hooks/
│   └── usePushNotifications.ts            # Hook completo Web Push
│
├── lib/push/
│   ├── web-push.ts                         # Utilidades servidor VAPID
│   └── templates.ts                        # Plantillas de notificaciones
│
├── supabase/migrations/
│   └── 20240001_push_subscriptions.sql    # Tabla + RLS + triggers
│
└── scripts/
    ├── generate-vapid-keys.mjs             # Genera claves VAPID
    └── generate-icons.mjs                  # Genera iconos PNG desde SVG
```

---

## Setup paso a paso

### 1. Instalar dependencias

```bash
npm install @serwist/next serwist web-push
npm install -D @types/web-push sharp
```

### 2. Generar claves VAPID

```bash
node scripts/generate-vapid-keys.mjs
# → copia las 3 líneas a .env.local
```

### 3. Generar iconos PWA

```bash
node scripts/generate-icons.mjs
# → public/icons/icon-{72,96,128,144,152,192,384,512}x*.png
```

### 4. Aplicar migración SQL

```bash
supabase db push
# o ejecuta manualmente en Supabase SQL Editor:
# supabase/migrations/20240001_push_subscriptions.sql
```

### 5. Configurar variables de entorno en Vercel

En Vercel Dashboard → Settings → Environment Variables:

| Variable | Dónde |
|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Production + Preview |
| `VAPID_PRIVATE_KEY` | Production only |
| `VAPID_SUBJECT` | Production only |
| `CRON_SECRET` | Production only |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only |

### 6. Deploy

```bash
git add .
git commit -m "feat: fase 4 — PWA, push notifications, offline"
git push origin main
# Vercel detecta el push y hace el deploy automáticamente
```

---

## Cómo funciona el sistema

### PWA e instalación

- `manifest.json` en `/public/` — declarado en `app/layout.tsx` via `metadata.manifest`.
- `@serwist/next` compila `app/sw.ts` → `public/sw.js` durante el build.
- `ServiceWorkerRegistrar` lo registra al cargar la app.
- La app aparece como "Instalar" en Chrome/Edge/Safari (iOS requiere "Añadir a inicio").

### Caché offline

| Recurso | Estrategia | TTL |
|---|---|---|
| Páginas Next.js | NetworkFirst | 24 h |
| API FoodData Central | CacheFirst | 7 días |
| API Open Food Facts | CacheFirst | 24 h |
| Imágenes | StaleWhileRevalidate | 30 días |
| Fuentes | CacheFirst | 30 días |
| API interna `/api/*` | NetworkFirst | 5 min |
| Sin red → documento | Fallback `/offline` | — |

### Notificaciones push

```
Cliente                    Servidor              Vercel Cron
  │                           │                      │
  ├─ subscribe() ──────────►  │                      │
  │   solicita permiso        │                      │
  │   suscribe PushManager    │                      │
  ├─ POST /api/push/subscribe ►                      │
  │                        guarda en DB              │
  │                           │                      │
  │                           │  ◄── GET /api/push/cron?type=almuerzo
  │                           │      (cada día 13:00 UTC)
  │                           │      lee suscripciones
  │                           │      envía vía web-push ──► Push Service
  │                           │                              │
  │  ◄── notificación ────────────────────────────────────── │
  │      (sw.ts onpush)       │                              │
```

### Cron schedules (UTC — Perú es UTC-5)

| Cron | UTC | Hora Perú |
|---|---|---|
| Desayuno | `30 11 * * *` | 06:30 |
| Almuerzo | `0 18 * * *` | 13:00 |
| Cena | `0 1 * * *` | 20:00 |
| Cierre día | `0 3 * * *` | 22:00 |
| Peso (lunes) | `0 13 * * 1` | 08:00 |

---

## Integrar en Settings

```tsx
// app/(app)/settings/page.tsx
import { PushSettingsToggle } from "@/components/push/PushNotificationManager";

export default function SettingsPage() {
  return (
    <section className="card">
      <h2 className="text-sm font-semibold text-slate-300 mb-4">Notificaciones</h2>
      <PushSettingsToggle />
    </section>
  );
}
```

---

## Checklist de salida Fase 4

- [ ] `npm run build` sin errores
- [ ] `public/sw.js` generado
- [ ] App instalable en Chrome móvil (icono "Instalar")
- [ ] `/offline` accesible sin red tras primera visita
- [ ] Dashboard y historial reciente funcionan offline
- [ ] Notificación de prueba recibida en dispositivo real
- [ ] Cron jobs activos en Vercel Dashboard → Cron Jobs
- [ ] Lighthouse PWA score ≥ 90
- [ ] Dark mode consistente en iOS y Android
- [ ] No hay regresiones en lógica de Fases 1–3
