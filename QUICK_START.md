# ⚡ Quick Start - SAM v6

## 🎯 Verificación en 5 Minutos

### 1️⃣ Health Check (Diagnostics)
```
https://sam-applive.vercel.app/api/health
```
**Qué ver**: JSON verde con todos los componentes ✅
- LLM: debe mostrar al menos Gemini configurado
- Payments: Stripe y/o Mercado Pago
- Database: si es null, es normal (opcional ahora)

### 2️⃣ Test LLM (Generación IA)
```
https://sam-applive.vercel.app/test-llm
```
**Qué hacer**:
1. Verifica que diga "✅ Configurado" en Gemini
2. Escribe un prompt en el textarea (ej: "Crea un plan de lección")
3. Click "🚀 Probar ahora"
4. Deberías recibir contenido generado por IA en 5 segundos

### 3️⃣ Suscripción (Pagos)
```
https://sam-applive.vercel.app/subscribe
```
**Qué hacer**:
1. Selecciona "💳 Tarjeta de Crédito" (Stripe)
2. Click "Continuar con el pago"
3. Deberías ir a formulario de Stripe
4. (No completes el pago, es solo verificar que funciona)

---

## 🔧 Configuración Requerida (Vercel)

### Variables a Agregar en Vercel

**Obligatorias (mínimo):**
```
LLM_API_KEY_GEMINI = [tu_key_de_aistudio.google.com]
STRIPE_SECRET_KEY = [tu_key_de_stripe]
STRIPE_WEBHOOK_SECRET = [tu_webhook_key_de_stripe]
```

**Opcionales pero recomendadas:**
```
MERCADO_PAGO_ACCESS_TOKEN = [tu_token_de_mercadopago]
NEXT_PUBLIC_BASE_URL = https://sam-applive.vercel.app
```

### Pasos para Agregar en Vercel:
```
1. Ir a: https://vercel.com/CarlosVergaraChile/Sam-app
2. Settings > Environment Variables
3. Agregar cada variable
4. Guarda y redeploy automático
```

---

## 📌 Lo Que Funciona HOY

✅ **Listo**: Generación IA real (Gemini, OpenAI, DeepSeek, etc.)  
✅ **Listo**: Checkout Stripe  
✅ **Listo**: Checkout Mercado Pago (código, necesita token)  
✅ **Listo**: Landing page y subscripción UI  
✅ **Listo**: Health check con diagnostics  

⏳ **No necesario ahora**: BD, autenticación, créditos  

---

## 🚀 Próximos Pasos (Order de Prioridad)

### Hoy/Mañana (30 minutos)
- [ ] Agregar GEMINI_API_KEY en Vercel si no lo hiciste
- [ ] Probar `/test-llm` que genere contenido
- [ ] Probar `/subscribe` que lleve a Stripe/MP

### Esta Semana (2-3 horas)
- [ ] Obtener token de Mercado Pago
- [ ] Agregar MERCADO_PAGO_ACCESS_TOKEN en Vercel
- [ ] Probar ambos métodos de pago funcionan

### La Próxima Semana (1 día)
- [ ] Crear proyecto Supabase
- [ ] Crear tablas (users, subscriptions, credits)
- [ ] Conectar webhooks de pago a BD

---

## 💬 Comandos Útiles

### Verificar deployment actual:
```bash
curl https://sam-applive.vercel.app/api/health | jq .
```

### Ver logs de Vercel:
```
https://vercel.com/CarlosVergaraChile/Sam-app/deployments
```

### Ver último commit:
```bash
git log --oneline | head -5
```

### Si necesitas hacer cambios locales:
```bash
npm run dev  # Local development
npm run build  # Verificar que compila
git push origin main  # Auto-deploy a Vercel
```

---

## 🆘 Troubleshooting Rápido

### Error: "No LLM API key configured"
→ Agregar `LLM_API_KEY_GEMINI=...` en Vercel  
→ Esperar redeploy automático (2 min)  
→ Refrescar página

### Error: "Stripe not configured"
→ Agregar `STRIPE_SECRET_KEY=sk_test_...` en Vercel  
→ Agregar `STRIPE_WEBHOOK_SECRET=whsec_...` en Vercel  

### Error: "Mercado Pago not configured"
→ Esto es OK, es opcional  
→ Solo aparecerá opción Stripe hasta que lo configures

### /test-llm devuelve error en el API
→ Verificar en `/api/health` qué falta  
→ Usualmente es falta de LLM_API_KEY  

---

## 📞 Documentación Completa

Si necesitas detalles, estos archivos tienen todo:

- `IMPLEMENTATION_SUMMARY.md` - Qué se hizo y estado actual
- `VERIFICATION_CHECKLIST.md` - Checklist detallado
- `docs/PAYMENT_SETUP.md` - Guía completa pagos Stripe + MP
- `docs/LLM_INTEGRATION_REPORT.md` - Arquitectura multi-LLM
- `docs/ENV_SETUP.md` - Obtener todas las keys

---

## ✨ Resumen: Haz Esto Primero

```
1. Verifica https://sam-applive.vercel.app/api/health
   (debería mostrar componentes en verde)

2. Prueba https://sam-applive.vercel.app/test-llm
   (debería generar contenido IA real)

3. Ve a https://sam-applive.vercel.app/subscribe
   (debería mostrar selector de pago)

Si los 3 están OK → ¡SAM está funcionando! 🎉
```

