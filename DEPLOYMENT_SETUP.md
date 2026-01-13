# SAM v6 - Setup de Despliegue Completo

**Estado**: Stub para One-Pass Deployment (FACTORY_POLICY)
**Objetivo**: Sistema operativo con todas integraciones funcionales

## 1. Supabase (Autenticación + BD)

### Crear Proyecto
1. Ir a https://supabase.com
2. Crear nuevo proyecto
3. Esperar inicialización (~2 min)

### Configurar BD
```sql
-- Tabla: usuarios (profesores, administradores)
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  nombre VARCHAR NOT NULL,
  rol VARCHAR DEFAULT 'teacher', -- 'teacher', 'admin', 'school_admin'
  colegio_id UUID REFERENCES colegios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: colegios (B2B)
CREATE TABLE public.colegios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  stripe_customer_id VARCHAR,
  plan VARCHAR DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: evaluaciones (OCR + feedback)
CREATE TABLE public.evaluaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  colegio_id UUID REFERENCES colegios(id),
  imagen_url VARCHAR,
  texto_extraido TEXT,
  feedback_curricular TEXT,
  score INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Credenciales
- **NEXT_PUBLIC_SUPABASE_URL**: `https://[project-id].supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Copiable desde Settings > API
- **SUPABASE_SERVICE_ROLE_KEY**: Copiable desde Settings > API

---

## 2. Stripe (Pagos + Facturación)

### Crear Productos y Planes
```bash
curl https://api.stripe.com/v1/products \
  -u sk_test_[YOUR_KEY]: \
  -d name="SAM v6 - Plan Básico" \
  -d type=service
```

### Planes Estándar
- **Básico**: 10 profesores, 1.000 evaluaciones/mes - $99/mes
- **Pro**: 50 profesores, 10.000 evaluaciones/mes - $499/mes
- **Enterprise**: Ilimitado - Custom pricing

### Webhook en Next.js
- Endpoint: `POST /api/webhooks/stripe`
- Escuchar: `customer.subscription.updated`, `customer.subscription.deleted`
- Actualizar tabla `colegios.plan`

### Credenciales
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: pk_test_...
- **STRIPE_SECRET_KEY**: sk_test_...
- **STRIPE_WEBHOOK_SECRET**: whsec_...

---

## 3. n8n (Orquestación de Workflows)

### Workflow: WhatsApp -> SAM -> Respuesta
1. Trigger: WhatsApp Cloud API (Image received)
2. Action: Descargar imagen
3. Action: Llamar `/api/evaluate` (SAM Python)
4. Action: Enviar respuesta vía WhatsApp

### Workflow: Stripe -> Supabase
1. Trigger: Stripe Webhook
2. Action: Actualizar estado de plan en Supabase
3. Action: Notificar a admin por email

### Credenciales n8n
- **N8N_API_URL**: https://n8n.tu-dominio.com
- **N8N_API_KEY**: Obtener de Settings > API

---

## 4. WhatsApp Cloud API

### Registrar Número Comercial
1. Ir a https://developers.facebook.com
2. Crear app (WhatsApp Business)
3. Obtener: Account ID, Phone Number ID, Access Token

### Configurar Webhook en n8n
- URL: `https://n8n.tu-dominio.com/webhook/whatsapp`
- Escuchar: `messages` events
- Token de verificación: Guardar en .env

### Credenciales
- **WHATSAPP_BUSINESS_ACCOUNT_ID**: `1234567890`
- **WHATSAPP_BUSINESS_PHONE_NUMBER_ID**: `1234567890`
- **WHATSAPP_ACCESS_TOKEN**: `EAAxx...`
- **WHATSAPP_WEBHOOK_TOKEN**: Tu-token-secreto

---

## 5. SAM Python API

### Endpoints (a documentar)

**POST /api/evaluate**
```json
{
  "image_url": "https://...",
  "subject": "math",
  "grade": 8
}
```

Respuesta:
```json
{
  "ok": true,
  "payload": {
    "extracted_text": "...",
    "feedback": "...",
    "score": 85
  }
}
```

### Health Check
**GET /api/health** -> `{ok: true, version: "6.0.0"}`

---

## 6. Vercel (Deployment)

### Conectar repo GitHub
1. Ir a https://vercel.com
2. Conectar GitHub
3. Seleccionar repo: `CarlosVergaraChile/Sam-app`
4. Seleccionar rama: `deploy/default-stack`
5. Agregar env vars (.env.production)

### Variables de Producción
- Todos los valores del .env.example
- URLs produccion (NEXT_PUBLIC_APP_URL, N8N_API_URL, etc)

### URL pública
`https://sam-v6-[random].vercel.app`

---

## 7. Checklista de Verificación

- [ ] Supabase proyecto creado y BD inicializada
- [ ] Stripe productos creados (3 planes)
- [ ] Stripe webhooks configurados
- [ ] n8n instancia activa
- [ ] n8n workflows: WhatsApp->SAM, Stripe->Supabase
- [ ] WhatsApp Business Account configurado
- [ ] WhatsApp webhook verificado
- [ ] SAM Python API online y respondiendo /health
- [ ] Vercel despliegue activo
- [ ] Todas env vars en Vercel
- [ ] Dashboard login funcional
- [ ] Prueba de evaluación OCR
- [ ] Prueba de pago en Stripe (test mode)
- [ ] Prueba de mensaje WhatsApp

---

## 8. Status Actual

**Stub**: Sí, esta es una plantilla. Necesita ser ejecutada manualmente o mediante scripts de automatización.

**Próximos pasos**: 
- Crear app layout Next.js (`app/page.tsx`)
- Crear API routes para Supabase, Stripe, n8n
- Crear componentes UI para dashboard
- Crear documentación de testing
