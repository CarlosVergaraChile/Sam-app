# Despliegue en Vercel - SAM v6

## 🚀 Despliegue Rápido

### 1. Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New Project"
3. Importa desde GitHub: `CarlosVergaraChile/Sam-app`
4. Vercel detectará automáticamente Next.js

### 2. Configurar Variables de Entorno

En el dashboard de Vercel > Settings > Environment Variables, añade:

#### Variables Obligatorias (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Variables Obligatorias (Stripe)
```
STRIPE_SECRET_KEY=sk_live_... (o sk_test_... para testing)
STRIPE_WEBHOOK_SECRET=whsec_... (crear tras configurar webhook)
```

#### Variables Opcionales
```
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-... (opcional para generador LLM)
```

### 3. Deploy

- Click "Deploy"
- Vercel compilará y desplegará automáticamente
- URL: `https://sam-app-<random>.vercel.app`

### 4. Configurar Stripe Webhook

**Después del primer deploy:**

1. Ve a [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://tu-dominio.vercel.app/api/webhooks/stripe`
4. Selecciona eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copia el **Signing Secret** (`whsec_...`)
6. Añádelo en Vercel como `STRIPE_WEBHOOK_SECRET`
7. Redeploy (Vercel > Deployments > Redeploy)

## 🔄 Despliegue Continuo

- Cada push a `main` despliega automáticamente
- Preview deployments para cada PR
- Rollback instantáneo desde el dashboard

## 🧪 Testing Local con Vercel CLI

```bash
npm install -g vercel
vercel login
vercel dev
```

## 📋 Checklist de Variables

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET (después de crear endpoint)
- [ ] NEXT_PUBLIC_BASE_URL (opcional, Vercel lo detecta)
- [ ] LLM_PROVIDER (opcional)
- [ ] LLM_API_KEY (opcional)

## 🐛 Troubleshooting

### Build fails
- Revisa logs en Vercel Dashboard > Deployments > Build Logs
- Verifica que todas las variables estén configuradas
- Asegúrate que el build local funciona: `npm run build`

### Webhook no funciona
- Verifica que `STRIPE_WEBHOOK_SECRET` esté correcto
- Revisa Function Logs en Vercel
- Testea el endpoint: `https://tu-dominio.vercel.app/api/webhooks/stripe`

### Supabase connection error
- Valida que las URLs y keys sean correctas
- Verifica que el proyecto Supabase esté activo
- Revisa logs de Supabase Dashboard

## 🔗 Enlaces Útiles

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- [Supabase Dashboard](https://app.supabase.com)
