# Configuración de Pagos - Stripe y Mercado Pago

## Descripción General

SAM v6 soporta **dos gateways de pago**:

1. **Stripe** - Global (Tarjetas de crédito internacionales)
2. **Mercado Pago** - Latin America (Tarjeta, transferencia, efectivo)

Los usuarios pueden elegir su método de pago preferido en `/subscribe`.

---

## 1. Configuración Stripe

### Obtener Credenciales

1. Ir a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Login con tu cuenta Stripe
3. En el sidebar, ir a: **Developers** → **API Keys**
4. Copiar:
   - `Publishable Key` (empieza con `pk_test_` o `pk_live_`)
   - `Secret Key` (empieza con `sk_test_` o `sk_live_`)

### Webhook Configuration

1. En Stripe Dashboard: **Developers** → **Webhooks**
2. Click "Add endpoint"
3. URL: `https://tu-dominio.com/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.paid`
5. Copiar el `Signing secret` (empieza con `whsec_`)

### Variables de Entorno

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
```

### Precios en Stripe

Hay dos precios configurados:

- **Early Bird** (hasta 28 Feb 2026): `price_1SphYfAaDeOcsC00sisonidT` = $7,990 CLP/mes
- **Regular**: `price_1SpIBTAaDeOcsC00GasIgBeN` = $9,990 CLP/mes

El sistema cambia automáticamente cuando vence Early Bird.

---

## 2. Configuración Mercado Pago

### Obtener Access Token

1. Ir a [Mercado Pago Developer Panel](https://www.mercadopago.com/developers/panel)
2. Login con tu cuenta Mercado Pago
3. En el sidebar: **Mis integraciones** → **Credenciales**
4. Ir a: **Producción** → **Access token**
5. Copiar el token (formato: `APP_USR_XXXXXXXXXXXXXXXX`)

### Webhook Configuration

1. En Mercado Pago: **Mis integraciones** → **Notificaciones IPN**
2. URL para Webhook: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Eventos:
   - ☑️ payment
   - ☑️ plan
   - ☑️ subscription

### Variables de Entorno

```bash
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Planes en Mercado Pago

Los planes se crean dinámicamente en el endpoint:

- **MONTHLY**: $9,990 CLP
- **EARLY_BIRD**: $7,990 CLP (si aún está vigente)

---

## 3. Configuración en Vercel

### Para Stripe

1. En Vercel Dashboard → Tu proyecto → **Settings** → **Environment Variables**
2. Agregar variables (deben ser idénticas a `.env.local`):

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
```

### Para Mercado Pago

1. En Vercel Dashboard → Tu proyecto → **Settings** → **Environment Variables**
2. Agregar variable:

```
MERCADO_PAGO_ACCESS_TOKEN = APP_USR_...
```

---

## 4. Flujo de Pago del Usuario

### Stripe
```
Usuario → /subscribe
         → Selecciona "Tarjeta de Crédito"
         → POST /api/checkout
         → Stripe Checkout session
         → Formulario de tarjeta Stripe
         → Redirección a /gracias
         → Webhook valida en Stripe
         → Usuario obtiene acceso
```

### Mercado Pago
```
Usuario → /subscribe
         → Selecciona "Mercado Pago"
         → POST /api/checkout/mercadopago
         → Mercado Pago preference creado
         → Redirección a checkout MP
         → Usuario selecciona método (tarjeta, transferencia, efectivo)
         → Redirección a /gracias
         → Webhook valida en Mercado Pago
         → Usuario obtiene acceso
```

---

## 5. Endpoints

### POST /api/checkout
**Stripe checkout**

Request:
```json
{
  "priceId": "price_1SpIBTAaDeOcsC00GasIgBeN"
}
```

Response:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_..."
}
```

---

### POST /api/checkout/mercadopago
**Mercado Pago checkout**

Request:
```json
{
  "planType": "MONTHLY"
}
```

Response:
```json
{
  "url": "https://www.mercadopago.com.ar/checkout/...",
  "preferenceId": "XXXXXXXXXXXXXXXX"
}
```

---

### POST /api/webhooks/stripe
**Stripe webhook receiver**

Headers:
```
stripe-signature: t=...,v1=...
```

Eventos procesados:
- `checkout.session.completed` → Crear/activar suscripción
- `customer.subscription.created` → Activar acceso
- `invoice.paid` → Renovación de suscripción

---

### POST /api/webhooks/mercadopago
**Mercado Pago webhook receiver**

Query params:
```
?topic=payment&id=12345678
```

Eventos procesados:
- `topic=payment` → Verificar estado de pago
- `topic=subscription` → Renovación de suscripción

---

## 6. Estados de Pago

### Stripe
- `succeeded` → ✅ Pago aprobado
- `processing` → ⏳ En proceso
- `requires_payment_method` → ❌ Requiere método de pago

### Mercado Pago
- `approved` → ✅ Pago aprobado
- `pending` → ⏳ En espera de confirmación
- `rejected` → ❌ Pago rechazado
- `cancelled` → 🚫 Pago cancelado
- `refunded` → 🔄 Reembolsado
- `charged_back` → ⚠️ Contracargo

---

## 7. Integración en Base de Datos (TODO)

Cuando un webhook reciba la confirmación de pago:

1. **Crear registro en `subscriptions`**:
   ```sql
   INSERT INTO subscriptions (
     user_id, 
     payment_method, 
     external_payment_id,
     status,
     current_period_start,
     current_period_end,
     cancel_at_period_end
   ) VALUES (...)
   ```

2. **Crear entrada en `credits`**:
   ```sql
   INSERT INTO credits (
     user_id,
     amount,
     reason,
     expires_at
   ) VALUES (user_id, 1000, 'monthly_subscription', ...)
   ```

3. **Actualizar `users.subscription_active`**:
   ```sql
   UPDATE users SET subscription_active = true WHERE id = user_id
   ```

---

## 8. Testing Local

### Stripe Test Cards
```
Visa: 4242 4242 4242 4242
     Any future date, Any CVC
     
Visa (declined): 4000 0000 0000 0002
```

### Mercado Pago Sandbox
```
Access Token: APP_TEST_XXXXXXXXXXXX (get from dev panel)
Test URL: https://sandbox.mercadopago.com.ar/checkout/...
```

---

## 9. Monitoreo

### Stripe
- Dashboard: https://dashboard.stripe.com/logs
- Buscar por: `event_type`, `status`, `customer_id`

### Mercado Pago
- Notifications Log: Mercado Pago Dev Panel → Notificaciones
- Historial de pagos: https://www.mercadopago.com.ar/activities

---

## 10. Troubleshooting

### Error: "Mercado Pago not configured"
→ Verificar `MERCADO_PAGO_ACCESS_TOKEN` en `.env.local` o Vercel

### Error: "Stripe not configured"
→ Verificar `STRIPE_SECRET_KEY` en `.env.local` o Vercel

### Webhook no se ejecuta
- **Stripe**: Verificar URL en Stripe Dashboard matching `https://tu-dominio.com/api/webhooks/stripe`
- **Mercado Pago**: Verificar URL en MP Dev Panel matching `https://tu-dominio.com/api/webhooks/mercadopago`

### Pago procesado pero usuario no obtiene acceso
→ Revisar logs de webhook en Stripe/MP dashboard
→ Verificar que la base de datos está configurada (supabase)
→ Revisar función de activación de suscripción en webhooks

---

## Referencias

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout Session API](https://stripe.com/docs/api/checkout/sessions)
- [Mercado Pago Docs](https://www.mercadopago.com/developers/es/reference)
- [Mercado Pago Preferences API](https://www.mercadopago.com/developers/es/reference/preferences/_checkout_preferences/post)
- [Mercado Pago IPN Notifications](https://www.mercadopago.com/developers/es/reference/ipn/_notifications_topic/post)

