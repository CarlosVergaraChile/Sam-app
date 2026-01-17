# Configuración de Stripe Webhooks

## 🎯 Propósito

Los webhooks de Stripe notifican a tu app sobre eventos importantes como:
- Pagos completados
- Suscripciones creadas/actualizadas/canceladas
- Facturas pagadas o fallidas

## 🔧 Setup en Producción (Vercel)

### 1. Despliega la app en Vercel

Primero completa el despliegue siguiendo [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

### 2. Crea el Webhook en Stripe

1. Ve a [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Configuración:
   - **Endpoint URL**: `https://tu-dominio.vercel.app/api/webhooks/stripe`
   - **Description**: "SAM Production Webhook"
   - **Version**: Latest API version
   - **Events to send**:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`

4. Click "Add endpoint"
5. Copia el **Signing secret** (empieza con `whsec_...`)

### 3. Añade el Secret a Vercel

1. Ve a tu proyecto en Vercel > Settings > Environment Variables
2. Añade nueva variable:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (el secret copiado)
   - **Environments**: Production, Preview, Development
3. Guarda y **redeploy** la aplicación

### 4. Prueba el Webhook

1. En Stripe Dashboard > Webhooks, click en tu endpoint
2. Click "Send test webhook"
3. Selecciona `checkout.session.completed`
4. Revisa que el status sea 200 OK

## 🧪 Testing Local

### Opción 1: Stripe CLI (Recomendado)

```bash
# Instalar Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Docs: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks a tu local
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Copia el webhook secret (whsec_...) y añádelo a .env.local:
# STRIPE_WEBHOOK_SECRET=whsec_...

# En otra terminal, corre tu app
npm run dev

# Trigger un evento de prueba
stripe trigger checkout.session.completed
```

### Opción 2: ngrok + Stripe Dashboard

```bash
# Instalar ngrok: https://ngrok.com/download
ngrok http 3000

# Usa la URL https:// generada en Stripe Dashboard
# Crea un webhook endpoint temporal apuntando a:
# https://your-ngrok-url.ngrok.io/api/webhooks/stripe
```

## 📊 Monitoreo

### En Stripe Dashboard

- Webhooks > [Tu endpoint] > Logs
- Revisa intentos, respuestas y reintentos

### En Vercel

- Tu proyecto > Logs > Filter by `/api/webhooks/stripe`
- Revisa Function Logs para debugging

## 🔒 Seguridad

El endpoint verifica la firma de Stripe antes de procesar:

```typescript
const sig = req.headers.get("stripe-signature");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Verifica que la request viene de Stripe
const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
```

**Nunca** proceses webhooks sin verificar la firma.

## 🐛 Troubleshooting

### Error: "Missing STRIPE_WEBHOOK_SECRET"
- Asegúrate que la variable esté en Vercel
- Redeploy tras añadir variables

### Error: "Signature verification failed"
- El secret es incorrecto
- Verifica que copiaste el correcto del Dashboard
- Asegúrate de usar el secret del endpoint correcto (prod vs test)

### Webhook returns 500
- Revisa Function Logs en Vercel
- Verifica que STRIPE_SECRET_KEY esté configurada
- Testea el endpoint manualmente

### Eventos no se procesan
- Verifica que los tipos de evento estén configurados
- Revisa la lógica en `app/api/webhooks/stripe/route.ts`
- Añade logging para debugging

## 📝 Eventos Actuales

Actualmente el endpoint recibe pero no procesa completamente:
- ✅ `checkout.session.completed` - Detectado
- ✅ `customer.subscription.created` - Detectado
- ✅ `invoice.paid` - Detectado

Para implementar la lógica de negocio, edita:
- `app/api/webhooks/stripe/route.ts`
- Integra con Supabase para actualizar usuarios/suscripciones

## 🔗 Referencias

- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
