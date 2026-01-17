# SAM v6 - Sistema de Aprendizaje Manuscrito v6

## Descripción

SAM v6 es una plataforma SaaS web para evaluación automática de respuestas manuscritas de estudiantes.

## 📚 Documentación

- [🚀 Despliegue en Vercel](./VERCEL_DEPLOY.md) - Guía completa de deployment
- [🔗 Configuración Stripe Webhooks](./STRIPE_WEBHOOKS.md) - Setup de webhooks en producción
- [⚙️ Variables de Entorno](./README.env.md) - Configuración de .env.local

## 🏁 Quick Start Local

### Requisitos
- Node.js 18+ y npm
- Cuentas en: Supabase, Stripe (opcional para testing)

### Setup

```bash
# Clonar e instalar
git clone https://github.com/CarlosVergaraChile/Sam-app.git
cd Sam-app
npm install

# Configurar entorno
cp .env.local.example .env.local
# Edita .env.local con tus credenciales

# Desarrollo
npm run dev
# Abre http://localhost:3000

# Compilar
npm run build
npm run start
```

### Características Principales
- **OCR Manuscrito**: Reconocimiento óptico de caracteres para respuestas escritas a mano
- **Feedback Curricular**: Evaluación basada en estándares curriculares chilenos (RAG)
- **Integración B2B**: Suscripción por colegio/institución educativa
- **WhatsApp Integration**: Envío de pruebas manuscritas vía WhatsApp para evaluación
- **Dashboard Multi-tenant**: Portal para docentes y administradores de colegios
- **Stripe Integration**: Pagos y planes de suscripción

## Stack Tecnológico

- **Frontend**: Next.js 14+ (Vercel)
- **Backend**: API REST + Microservicios Python
- **Autenticación**: Supabase Auth
- **Base de Datos**: Supabase (PostgreSQL)
- **Pagos**: Stripe
- **Orquestación**: n8n
- **Mensajería**: WhatsApp Cloud API

## Estado del Proyecto

**FASE**: Inicialización - One-Pass Deployment (FACTORY_POLICY)

### Stubs/TODO
- [ ] Next.js starter inyectado
- [ ] Supabase project configurado
- [ ] Stripe products creados
- [ ] n8n workflows configurados
- [ ] WhatsApp integration activa
- [ ] Python API endpoints (OCR, evaluación, feedback)
- [ ] Dashboard de docentes
- [ ] Dashboard de administración

## Configuración Rápida

Proxímamente: Scripts de inicialización automatizada

## Equipo

- **Carlos Vergara**: Lead Developer

## Licencia

Proprietario
