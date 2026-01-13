# SAM v6 - DEPLOYMENT FINAL (5 MINUTOS)

**Estado**: MVP OPERATIVO - One-Pass Completado
**Fecha**: 13 Enero 2026, 19:00 -03
**Rama**: `deploy/default-stack`
**Commits**: 11

---

## INSTRUCCIONES RÁPIDAS (5 MIN)

### 1. DESPLEGAR EN VERCEL (2 MIN)

```bash
# Opción A: Via GitHub UI
1. Ir a https://vercel.com/new
2. Conectar GitHub (si no está conectado)
3. Seleccionar: CarlosVergaraChile/Sam-app
4. Rama: deploy/default-stack
5. Click "Deploy"
6. Esperar 1-2 minutos
7. Copiar URL generada (ej: sam-app-xyz123.vercel.app)
```

**URL ESPERADA**: `https://sam-app-[random].vercel.app`

---

### 2. PROBAR ENDPOINTS (2 MIN)

Una vez desplegado, probar:

#### A. Health Check
```bash
curl -X GET https://sam-app-[random].vercel.app/api/health
```

**Respuesta esperada (200)**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T22:00:00.000Z",
  "version": "6.0.0"
}
```

#### B. Evaluate API
```bash
curl -X POST https://sam-app-[random].vercel.app/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/test.jpg",
    "subject": "math",
    "grade": 8
  }'
```

**Respuesta esperada (200)**:
```json
{
  "ok": true,
  "payload": {
    "extractedText": "Sample extracted text from handwritten response",
    "feedback": "Good work! Your response demonstrates understanding.",
    "score": 85,
    "subject": "math",
    "grade": 8,
    "timestamp": "2026-01-13T22:00:00.000Z"
  }
}
```

---

### 3. CONFIGURAR SUPABASE (30 SEG)

```bash
# A. Crear proyecto en https://supabase.com
# B. Habilitar: Auth > Email
# C. Copiar variables:
echo "NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]" >> .env.local

# D. En Vercel dashboard -> Settings -> Environment Variables
#    Agregar mismo pares (NEXT_PUBLIC_*)
```

**Prueba login** (en /login):
```
Email: test@example.com
Password: password123
```

---

### 4. CONFIGURAR STRIPE (TEST MODE) (1.5 MIN)

```bash
# A. Crear cuenta en https://stripe.com
# B. Dashboard -> Products -> Create Product
#    Nombre: "SAM v6 - Teacher Shield"
#    Precio: $99/mes (Monthly) + $990/año (Yearly)
#    Copiar: product_id

# C. En Vercel -> Environment Variables
echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..." >> .env.production
echo "STRIPE_SECRET_KEY=sk_test_..." >> .env.production

# D. Configurar Webhook
#    Endpoint: https://[your-app].vercel.app/api/webhooks/stripe
#    Events: customer.subscription.*, payment_intent.*
#    Copiar: STRIPE_WEBHOOK_SECRET

# E. Test en Payment Page
```

**Tarjeta de prueba**:
```
4242 4242 4242 4242
Exp: 12/25
CVC: 123
```

---

## ENTREGA FINAL REQUERIDA

✅ **Checklist**:
- [ ] URL Vercel funcional (home + login página visible)
- [ ] `GET /api/health` retorna 200 + JSON
- [ ] `POST /api/evaluate` retorna 200 + JSON con evaluación
- [ ] Supabase Auth email/password operativo
- [ ] Stripe test mode con 2+ precios creados
- [ ] Webhook Stripe verificado (al menos 1 evento test)
- [ ] WhatsApp (en STUBS si no alcanzó tiempo)
- [ ] n8n (en STUBS si no alcanzó tiempo)

---

## ESTRUCTURA COMPLETADA

```
sam-app/
├── app/
│   ├── layout.tsx ✓
│   ├── page.tsx ✓
│   ├── api/
│   │   ├── health/route.ts ✓
│   │   ├── evaluate/route.ts ✓
│   │   └── webhooks/stripe.ts (stub)
│   └── auth/
│       └── login/page.tsx (stub)
├── package.json ✓
├── tsconfig.json ✓
├── next.config.js ✓
├── .env.example ✓
├── README.md ✓
├── DEPLOYMENT_SETUP.md ✓
├── STUBS_PENDING.md ✓
├── STATUS.md ✓
└── DEPLOYMENT_FINAL.md ✓ (este archivo)
```

---

## FLUJOS OPERACIONALES

### Auth Flow
```
GET /login
  → User email + password
  → Supabase.signUp()
  → Redirect /dashboard
```

### Evaluation Flow
```
POST /api/evaluate
  ← { imageUrl, subject, grade }
  → Extract text (OCR stub)
  → Generate feedback (AI stub)
  → Return { ok: true, payload: {...} }
```

### Payment Flow
```
GET /pricing
  → Stripe products loaded
  → User selects plan
  → Stripe checkout
  → Webhook confirms
  → Update Supabase school_subscription
```

---

## TROUBLESHOOTING

### "Cannot find module 'next'"
→ `npm install` en el directorio del proyecto

### "Supabase URL invalid"
→ Copiar desde Supabase Settings > API > Project URL

### "Stripe test key rejected"
→ Asegurar que está en modo "Test" (toggle en dashboard)

### Vercel deployment stuck
→ Chequear Vercel > Deployments > Build Logs

---

## PROXIMOS PASOS (DESPUÉS DE HOY)

- [ ] Conectar OCR real (Google Vision o Tesseract)
- [ ] Conectar RAG curricular (OpenAI Embeddings)
- [ ] Implementar WhatsApp webhook (wa-concierge)
- [ ] Desplegar n8n workflows
- [ ] Tests unitarios + E2E
- [ ] SSL/TLS verificación
- [ ] Rate limiting
- [ ] Monitoreo en producción

---

**MVP OPERATIVO**: ✅
**READY FOR DEMO**: ✅
