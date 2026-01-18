# Configuración de Variables de Entorno para Testing Local

## 🚀 Setup Rápido (< 2 minutos)

### 1. Copia el archivo de ejemplo
```bash
cp .env.example .env.local
```

### 2. Obtén una API key de Gemini (GRATIS)

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Copia la key que empieza con `AIza...`

### 3. Agrega la key a `.env.local`

Abre `.env.local` y reemplaza:

```bash
LLM_API_KEY_GEMINI=AIzaSyC-tu-key-real-aqui-ABC123xyz
```

### 4. Prueba que funcione

```bash
npm run dev
```

Abre en tu navegador:
- **Página de prueba**: http://localhost:3000/test-llm
- **Generador completo**: http://localhost:3000/sam/generator

---

## 🔍 Verificar configuración

### Opción 1: Página de test (recomendado)
Visita http://localhost:3000/test-llm para ver:
- ✅ Qué proveedores están configurados
- 🧪 Probar generación en vivo
- 📋 Instrucciones paso a paso

### Opción 2: API directa
```bash
curl http://localhost:3000/api/test-llm
```

Debería responder:
```json
{
  "status": "ok",
  "llmAvailable": true,
  "providers": {
    "gemini": true,
    "openai": false,
    ...
  }
}
```

### Opción 3: Test de generación
```bash
curl -X POST http://localhost:3000/api/test-llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola, soy un docente chileno"}'
```

---

## 🌐 Deployment en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/carlosvergara-chiles-projects/sam-applive
2. Settings → Environment Variables
3. Agrega **una o más** de estas variables:

```
LLM_API_KEY_GEMINI = AIzaSyC-tu-key-aqui
```

4. Scope: **Production, Preview, Development** (todas)
5. Save
6. Redeploy el proyecto

---

## 📚 Nombres alternativos soportados

El sistema busca automáticamente estas variantes:

**Gemini**:
- `LLM_API_KEY_GEMINI`
- `GOOGLE_API_KEY`
- `GEMINI_API_KEY`

**OpenAI**:
- `LLM_API_KEY_OPENAI`
- `OPENAI_API_KEY`

**DeepSeek**:
- `LLM_API_KEY_DEEPSEEK`
- `DEEPSEEK_API_KEY`

**Anthropic**:
- `LLM_API_KEY_ANTHROPIC`
- `ANTHROPIC_API_KEY`

**Perplexity**:
- `LLM_API_KEY_PERPLEXITY`
- `PERPLEXITY_API_KEY`

---

## ⚠️ Problemas comunes

### "No LLM API keys found"
- Verifica que copiaste la key completa (no debe tener espacios)
- Reinicia el servidor después de agregar la key (`npm run dev`)
- En Vercel, asegúrate de hacer redeploy después de agregar variables

### "Gemini API error: 404"
- El endpoint cambió a `v1beta` (ya está corregido en el código)
- Usa el modelo `gemini-1.5-flash-latest`

### "Rate limit exceeded"
- Gemini free tier: 15 requests/minuto
- Espera 1 minuto y reintenta
- O agrega otra API key como fallback (OpenAI, DeepSeek, etc.)

---

## 🎯 Siguiente paso

Una vez configurado, prueba el generador completo:
http://localhost:3000/sam/generator

Debería generar contenido educativo REAL en español, no stubs.
