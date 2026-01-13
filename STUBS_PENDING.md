# SAM v6 - Stubs Pendientes

**Estado**: One-Pass Phase 1 Completado (Infraestructura)
**Próxima fase**: Implementación de Features y Integraciones

---

## Fase 1 Completada ✅

- [x] Repositorio GitHub creado
- [x] Rama `deploy/default-stack` creada
- [x] Configuración base Next.js (package.json)
- [x] next.config.js con CORS
- [x] .env.example documentado
- [x] README.md con descripción del proyecto
- [x] DEPLOYMENT_SETUP.md con instrucciones

---

## Fase 2: Implementación de Code (PENDIENTE)

### Backend - Estructura de API
- [ ] `app/api/auth/route.ts` - Autenticación Supabase
- [ ] `app/api/webhooks/stripe.ts` - Webhook Stripe
- [ ] `app/api/webhooks/whatsapp.ts` - Webhook WhatsApp
- [ ] `app/api/evaluate.ts` - Proxy a SAM Python API
- [ ] `app/api/health.ts` - Health check
- [ ] `lib/supabase.ts` - Cliente Supabase
- [ ] `lib/stripe.ts` - Cliente Stripe
- [ ] `lib/whatsapp.ts` - Cliente WhatsApp API
- [ ] `lib/sam-api.ts` - Cliente SAM Python API

### Frontend - UI Components
- [ ] `app/page.tsx` - Landing page
- [ ] `app/layout.tsx` - Root layout
- [ ] `app/dashboard/page.tsx` - Dashboard principal
- [ ] `app/auth/login/page.tsx` - Login page
- [ ] `app/auth/signup/page.tsx` - Signup page
- [ ] `components/Header.tsx` - Header global
- [ ] `components/Navbar.tsx` - Navigation
- [ ] `components/EvaluationForm.tsx` - Form para subir imagen
- [ ] `components/EvaluationResult.tsx` - Mostrar resultado OCR
- [ ] `components/PricingPlans.tsx` - Tabla de planes
- [ ] `components/SubscriptionManager.tsx` - Gestión de suscripciones

### State Management
- [ ] `store/auth.ts` - Store de autenticación (Zustand)
- [ ] `store/evaluation.ts` - Store de evaluaciones
- [ ] `store/subscription.ts` - Store de suscripción

### Utilidades
- [ ] `utils/api-client.ts` - Cliente HTTP centralizado
- [ ] `utils/validators.ts` - Validadores de formularios
- [ ] `utils/formatters.ts` - Formateadores de datos
- [ ] `hooks/useAuth.ts` - Hook de autenticación
- [ ] `hooks/useEvaluation.ts` - Hook de evaluaciones
- [ ] `hooks/useSubscription.ts` - Hook de suscripciones

---

## Fase 3: Integraciones Externas (PENDIENTE)

### Supabase
- [ ] Crear proyecto Supabase
- [ ] Ejecutar SQL del DEPLOYMENT_SETUP.md
- [ ] Configurar Row Level Security (RLS)
- [ ] Activar Email authentication
- [ ] Generar API keys

### Stripe
- [ ] Crear cuenta Stripe
- [ ] Crear 3 productos (Basic, Pro, Enterprise)
- [ ] Crear 3 planes de precios
- [ ] Configurar webhook secret
- [ ] Generar API keys

### n8n
- [ ] Desplegar instancia n8n (Vercel o autohosting)
- [ ] Crear workflow: WhatsApp -> SAM -> Respuesta
- [ ] Crear workflow: Stripe Webhook -> Supabase
- [ ] Configurar credenciales de integración
- [ ] Generar API key

### WhatsApp Cloud API
- [ ] Crear WhatsApp Business Account
- [ ] Registrar número comercial
- [ ] Obtener Access Token
- [ ] Configurar webhook en n8n
- [ ] Probar envío/recepción de mensajes

### SAM Python API
- [ ] Desplegar microservicio Python
- [ ] Exponer endpoint `/api/evaluate`
- [ ] Exponer endpoint `/api/health`
- [ ] Documentar contrato JSON
- [ ] Crear tests de integración

---

## Fase 4: Deployment (PENDIENTE)

- [ ] Conectar GitHub a Vercel
- [ ] Seleccionar rama `deploy/default-stack`
- [ ] Configurar Environment Variables en Vercel
- [ ] Deploy inicial
- [ ] Verificar health check
- [ ] Smoke tests en producción

---

## Testing (PENDIENTE)

- [ ] Tests unitarios (Jest)
- [ ] Tests de integración (API routes)
- [ ] Tests E2E (Playwright)
- [ ] Test de flujo de autenticación
- [ ] Test de flujo de evaluación OCR
- [ ] Test de flujo de pago (Stripe test mode)
- [ ] Test de mensajes WhatsApp

---

## Documentación (PENDIENTE)

- [ ] API documentation (OpenAPI/Swagger)
- [ ] Guía de desarrollo local
- [ ] Guía de troubleshooting
- [ ] Guía de escalabilidad
- [ ] Video tutorial de setup

---

## Estimación de Esfuerzo

- **Fase 1 (Infraestructura)**: ✅ 1-2 horas
- **Fase 2 (Code)**: 40-50 horas
- **Fase 3 (Integraciones)**: 20-30 horas
- **Fase 4 (Deployment)**: 5-10 horas
- **Testing**: 30-40 horas
- **Documentación**: 10-15 horas

**Total estimado**: 140-170 horas de desarrollo

---

## Prioridad Crítica

Para MVP operativo:
1. Fase 2 API: `auth`, `evaluate`, `health`
2. Fase 2 Frontend: `login`, `dashboard`, `evaluation-form`
3. Fase 3: Supabase + Stripe (método de pago)
4. Fase 4: Deploy a Vercel

Esto permitiría tener un sistema básico operativo en ~60 horas.
