# SAM v6 - VERCEL DEPLOYMENT (DIRECT METHOD)

## ⏱️ 1-Click Deployment (3 minutos)

### 👇 OPCIÓN RÁPIDA: Click aquí

🔗 **[DESPLEGAR EN VERCEL AHORA](https://vercel.com/new?repo-url=https://github.com/CarlosVergaraChile/Sam-app&project-name=sam-v6&root-directory=.&framework=next.js&branch=deploy/default-stack)**

---

## PASO A PASO (si el link arriba no funciona)

### 1. Ir a Vercel
```
https://vercel.com/new
```

### 2. Conectar GitHub
- Click "GitHub" or "Continue with GitHub"
- Autorizar Vercel en GitHub

### 3. Buscar y Seleccionar Repo
- Buscar: `Sam-app` o `CarlosVergaraChile/Sam-app`
- Seleccionar

### 4. Configurar Rama
- **Production Branch**: `deploy/default-stack` (IMPORTANTE)
- Click "Deploy"
- Esperar 2-3 minutos

### 5. Copiar URL
Vercel te dará una URL como:
```
https://sam-v6-[random-id].vercel.app
```

Guarda esta URL. Es tu **VERCEL_URL**.

---

## PASO 2: VERIFICAR ENDPOINTS

### A) Health Check
```bash
curl -X GET https://sam-v6-[random-id].vercel.app/api/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T22:45:00.000Z",
  "version": "6.0.0"
}
```

### B) Evaluate API
```bash
curl -X POST https://sam-v6-[random-id].vercel.app/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/test.jpg",
    "subject": "math",
    "grade": 8
  }'
```

**Respuesta esperada**:
```json
{
  "ok": true,
  "payload": {
    "extractedText": "Sample extracted text from handwritten response",
    "feedback": "Good work! Your response demonstrates understanding.",
    "score": 85,
    "subject": "math",
    "grade": 8,
    "timestamp": "2026-01-13T22:45:00.000Z"
  }
}
```

✅ Si ambos endpoints retornan 200, el MVP está operativo.

---

## PASO 3: SUPABASE SETUP (30 SEG)

### A) Crear Proyecto
1. Ir a https://supabase.com
2. Click "New Project"
3. Nombre: `sam-v6`
4. Elegir región: `us-east` (por defecto)
5. Click "Create"
6. Esperar 2 minutos

### B) Obtener Credenciales
1. En Supabase: Settings > API
2. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### C) Habilitar Email Auth
1. Auth > Users (sidebar)
2. Supabase ya viene con email/password habilitado
3. No necesitas hacer nada aquí

### D) Agregar a Vercel
1. Ir a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agregar:
   - Key: `NEXT_PUBLIC_SUPABASE_URL` Value: `https://[project-id].supabase.co`
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` Value: `[anon-key-aqui]`
4. Click "Deploy" nuevamente
5. Esperar 1 minuto

### E) Prueba
1. Ir a `https://sam-v6-[id].vercel.app/login` (ruta creada)
2. Crear cuenta: `test@example.com` / `Test123!`
3. Si carga el form y acepta datos → OK

---

## PASO 4: STRIPE SETUP (2 MIN)

### A) Crear Cuenta Stripe
1. Ir a https://stripe.com
2. Click "Start now"
3. Crear cuenta
4. Ir a Dashboard

### B) Activar Test Mode
- Switch a **Test Mode** (en la parte superior)

### C) Crear Producto
1. Left sidebar > Products
2. Click "Add product"
3. Nombre: `SAM v6 - Teacher Shield`
4. Descripción: `Handwritten response evaluation platform`
5. Click "Create"

### D) Crear Precios
1. En el producto, click "Add pricing"
2. **Precio 1 (Mensual)**:
   - Amount: `9900` (cents = $99)
   - Billing period: Monthly
   - Click "Save"
3. **Precio 2 (Anual)**:
   - Amount: `99000` (cents = $990)
   - Billing period: Yearly
   - Click "Save"

### E) Obtener API Keys
1. Left sidebar > Developers > API keys
2. Copiar:
   - `Publishable key` (starts `pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` (starts `sk_test_...`) → `STRIPE_SECRET_KEY`

### F) Crear Webhook
1. Left sidebar > Developers > Webhooks
2. Click "Add endpoint"
3. URL: `https://sam-v6-[id].vercel.app/api/webhooks/stripe`
4. Events to send:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Click "Add endpoint"
6. Copiar el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### G) Agregar a Vercel
1. Vercel > Settings > Environment Variables
2. Agregar 3 variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. Click "Deploy"

### H) Test Webhook
1. Vuelve a Stripe > Developers > Webhooks
2. Click en el endpoint que creaste
3. Click "Send test event"
4. Elegir: `customer.subscription.created`
5. Click "Send event"
6. Si ves status 200 → ✅ Webhook funciona

---

## ✅ VALIDACIÓN FINAL

```bash
# 1. Health check
curl -s https://sam-v6-[id].vercel.app/api/health | jq .

# 2. Evaluate endpoint
curl -s -X POST https://sam-v6-[id].vercel.app/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/test.jpg"}' | jq .

# 3. Home page
curl -s https://sam-v6-[id].vercel.app/ | head -20
```

Si todo retorna 200 y JSON válido → **MVP OPERATIVO ✅**

---

## 🚨 TROUBLESHOOTING

### "Vercel deployment fails"
- Chequea Build Logs en Vercel
- Asegurate que rama es `deploy/default-stack`

### "Endpoint retorna 500"
- Chequea Vercel Logs
- Asegurate que env vars están configuradas

### "Supabase connection timeout"
- Copia exactamente la URL (incluyendo .co)
- Supabase puede tardar 2min en activar

### "Stripe webhook not triggered"
- Chequea que endpoint URL es HTTPS
- Retry el test event
- Chequea Stripe Logs

---

## 📍 URLS A RECORDAR

```
APP_URL = https://sam-v6-[id].vercel.app
HEALTH = https://sam-v6-[id].vercel.app/api/health
EVALUATE = https://sam-v6-[id].vercel.app/api/evaluate
LOGIN = https://sam-v6-[id].vercel.app/login (stub)
DASHBOARD = https://sam-v6-[id].vercel.app/dashboard (stub)
```

---

**TIEMPO TOTAL**: ~5 minutos
**ESTADO**: MVP Operativo
