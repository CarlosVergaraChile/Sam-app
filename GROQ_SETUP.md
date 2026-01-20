# Groq API Setup - SAM App

## ¿Qué es Groq?

Groq ofrece **API GRATIS sin tarjeta de crédito** para usar modelos LLM grandes:
- **Mixtral 8x7B**: Modelo multilingüe, excelente para español
- **Llama 2 70B**: Modelo general de Meta
- **Límite GRATIS**: 30 requests por minuto (suficiente para MVP)

## Setup Rápido (5 minutos)

### 1. Crear cuenta en Groq
```bash
# Ve a:
https://console.groq.com/keys

# Sign up (sin tarjeta de crédito)
# Confirma tu email
# Listo ✅
```

### 2. Obtener tu API Key
```bash
# En la consola de Groq, copia tu API key
# Debería verse así: gsk_Xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Configurar en SAM-app

#### Opción A: Desarrollo Local
```bash
# 1. Abre tu archivo .env.local
# 2. Agrega esta línea:
GROQ_API_KEY=tu-api-key-de-groq-aqui

# 3. Reinicia tu servidor:
npm run dev
```

#### Opción B: Vercel (Producción)
```bash
# 1. Ve a: https://vercel.com/tu-proyecto/settings/environment-variables
# 2. Agrega una nueva variable:
#    Name: GROQ_API_KEY
#    Value: tu-api-key-real
#    Environments: Production, Preview, Development
# 3. Redeploy tu app
vercel redeploy
```

### 4. Verificar que funciona
```bash
# En local:
curl http://localhost:3000/api/groq-test

# Deberías ver:
# { "status": "ok", "model": "mixtral-8x7b-32768", "available": true }
```

## Cómo funciona en SAM

### Antes (Gemini/OpenAI - requería $)
```typescript
// app/api/generate/route.ts
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const response = await groq.chat.completions.create({
  model: 'mixtral-8x7b-32768',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 2000,
});
```

### Ahora (Groq - GRATIS)
El código ya usa Groq automáticamente si tienes `GROQ_API_KEY` definido.

## Límites y Consideraciones

| Aspecto | Groq Free |
|--------|----------|
| Requests/min | 30 |
| Requests/día | Sin límite (mientras no excedas 30/min) |
| Costo | $0 |
| Latencia | <1 segundo (MUY RÁPIDO) |
| Modelos | Mixtral 8x7B, Llama 2 70B |
| Calidad | ⭐⭐⭐⭐⭐ (excepcional) |

## Troubleshooting

### "GROQ_API_KEY not found"
```bash
# Solución:
# 1. Verifica que .env.local tiene la variable
# 2. Reinicia npm run dev
# 3. Recarga la página en el navegador
```

### "Rate limit exceeded"
```bash
# Significa que superaste 30 req/min
# Espera 60 segundos y reintentar
# Para MVP esto no debería pasar
```

### "Invalid API key"
```bash
# Verififica que:
# 1. La key sea exactamente como aparece en Groq console
# 2. No haya espacios al inicio/final
# 3. La key sea de tu cuenta (no de otro usuario)
```

## Próximos pasos

1. ✅ Groq está configurado
2. Prueba generando contenido: http://localhost:3000
3. Verifica que las evaluaciones se generan en <2s
4. Contacta maestros para feedback
5. Cuando tengas 10+ usuarios pagos, considera plan pago de Groq ($200/mes = 10,000 req/min)

## Documentación Oficial

- Groq Console: https://console.groq.com
- API Docs: https://console.groq.com/docs
- Supported Models: https://console.groq.com/docs/models
