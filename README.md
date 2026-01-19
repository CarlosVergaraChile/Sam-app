# SAM v6 - Sistema de Aprendizaje Manuscrito v6 
<!-- Test commit for Vercel auto-deployment -->

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

## Configuración de LLM para Generación de Contenidos

Sam-app utiliza un **router inteligente de proveedores LLM** que soporta múltiples APIs con fallback automático.

### Paso 1: Agregar una API Key

Edita tu archivo `.env.local` (local) o Vercel → Settings → Environment Variables (producción) y agrega **AL MENOS UNA** variable:

```env
# Opción recomendada (tier gratuito generoso)
LLM_API_KEY_GEMINI=tu-api-key-aqui

# O cualquiera de:
LLM_API_KEY_OPENAI=tu-api-key-aqui
LLM_API_KEY_DEEPSEEK=tu-api-key-aqui
LLM_API_KEY_ANTHROPIC=tu-api-key-aqui
LLM_API_KEY_PERPLEXITY=tu-api-key-aqui
```

### Paso 2: Reiniciar servidor

```bash
npm run dev
```

### Paso 3: Obtener API Keys

- **Gemini** (RECOMENDADO): https://aistudio.google.com/app/apikey
- **OpenAI**: https://platform.openai.com/api-keys
- Otras opciones: Ver [docs/API_KEYS_SETUP.md](./docs/API_KEYS_SETUP.md)

### Troubleshooting

Si ves el error `[FALLBACK] Todos los proveedores fallaron`:
1. Verifica que reiniciaste el servidor
2. Verifica el nombre exacto de la variable (case-sensitive)
3. Verifica que no haya espacios al inicio/final del valor
4. Consulta [docs/API_KEYS_SETUP.md](./docs/API_KEYS_SETUP.md) para más ayuda

Proprietario
