# 🧠 Todos los Proveedores de LLM en Sam-app

## Resumen Rápido

Sam-app soporta **7 proveedores de LLM** diferentes con fallback automático:

| # | Provider | Orden | Costo | Setup | Free Tier | Modelo | Estado |
|---|----------|-------|-------|-------|-----------|--------|--------|
| 1 | **Groq** | 1º (⭐) | $0 | ✅ Listo | Sí | Mixtral 8x7B | ✅ ACTIVO |
| 2 | **OpenAI** | 2º | Pago | ✅ Listo | No | GPT-4o | ✅ ACTIVO |
| 3 | **Gemini** | 3º | Pago | 🗐 PENDIENTE | Sí (limit) | Gemini 2.0 Flash | ⚠️ PENDIENTE |
| 4 | **Llama (Together)** | 4º | Pago | 🗐 PENDIENTE | Sí | Llama 3.3 70B | ⚠️ PENDIENTE |
| 5 | **Anthropic** | 5º | Pago | ❌ No | No | Claude 3.5 | ❌ NO AGREGADO |
| 6 | **Deepseek** | 6º | Pago | ❌ No | No | Deepseek 3 | ❌ NO AGREGADO |
| 7 | **Perplexity** | 7º | Pago | ❌ No | No | Sonar | ❌ NO AGREGADO |

---

## ✍️ Configuración Detallada

### 1⚡ GROQ (Recomendado - GRATIS)

**Ubicación:**
- Env: `GROQ_API_KEY`
- Local: `.env.local`
- Vercel: Environment Variables

**Status:** ✅ **COMPLETAMENTE LISTO**

**Configuración:**
```bash
GROQ_API_KEY=gsk1ybrzTRlhVq7VEThE9I8WGdyb3FYYu76wR8Uyz0Y7nm2a5eGtZo0
```

**Detalles:**
- Costo: $0 (completamente gratis)
- Tarjeta de crédito: NO
- Free tier: Sin límite oficial (30 req/min aprox)
- Velocidad: <1s por generación
- Modelo: Mixtral 8x7B (excelente para MVP)

---

### 2⚡ OPENAI

**Ubicación:**
- Env: `OPENAI_API_KEY`
- Local: `.env.local`
- Vercel: Environment Variables

**Status:** ✅ **COMPLETAMENTE LISTO**

**Configuración:**
```bash
OPENAI_API_KEY=sk-proj-4kZvOntrercix5IxVN6jbUag5RsK5rsqZ2tLj6t4cQGJ2hkU9-ukkvFYYznJpRI4NqjocNZ9bzT3BlbkFJ3nZssacjGLx5OcrYJLmggqi73ZHoJixxMxdDuak2iWdnxmgGjHvf63zVBx641bFITdOumzkkA
```

**Detalles:**
- Costo: Pago por token (~$0.03 por 1M tokens GPT-4)
- Tarjeta de crédito: SÍ (requerida)
- Free tier: $5 crédito (3 meses)
- Velocidad: ~2-3s por generación
- Modelo: GPT-4o (mejor calidad)

---

### 3⚡ GOOGLE GEMINI

**Ubicación:**
- Env: `GEMINI_API_KEY`
- Local: `.env.local`
- Vercel: Environment Variables

**Status:** ⚠️ **PENDIENTE DE CONFIGURACIÓN**

**Cómo obtener API key:**
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click en "Create API Key"
3. Selecciona proyecto (o crea uno)
4. Copia la key

**Configuración:**
```bash
# En .env.local
GEMINI_API_KEY=AIza...tu-key-aqui

# En Vercel:
# Settings → Environment Variables → Add
# Key: GEMINI_API_KEY
# Value: AIza...
```

**Detalles:**
- Costo: Gratuito hasta cierto uso (luego pago)
- Tarjeta de crédito: NO (para free tier)
- Free tier: 60 req/min
- Velocidad: ~1-2s por generación
- Modelo: Gemini 2.0 Flash (rápido y barato)

---

### 4⚡ LLAMA (via Together AI)

**Ubicación:**
- Env: `TOGETHER_API_KEY` (o `LLAMA_API_KEY`)
- Local: `.env.local`
- Vercel: Environment Variables

**Status:** ⚠️ **PENDIENTE DE CONFIGURACIÓN**

**Cómo obtener API key:**
1. Ve a [Together AI](https://www.together.ai/)
2. Sign up gratis
3. Click en "API" en dashboard
4. Copia la API key

**Configuración:**
```bash
# En .env.local
TOGETHER_API_KEY=tu-key-together-ai
# O alternativamente:
LLAMA_API_KEY=tu-key-together-ai

# En Vercel:
# Settings → Environment Variables → Add
# Key: TOGETHER_API_KEY
# Value: ...
```

**Detalles:**
- Costo: Gratuito (con tarjeta de crédito)
- Tarjeta de crédito: SÍ (pero free tier)
- Free tier: $25 crédito al mes
- Velocidad: ~1-2s por generación
- Modelo: Llama 3.3 70B (excelente relación costo/calidad)

---

## 🗐 Pendiente de Agregar

### Anthropic, Deepseek, Perplexity

Estos proveedores están disponibles en el código pero AÚN no están configurados en `.env.local` o Vercel.

Si quieres agregarlos:
1. Edita `.env.local`
2. Agrega: `ANTHROPIC_API_KEY=...` (o similar)
3. Sube a Vercel Environment Variables
4. Redeploy

---

## 🚀 Cómo Funciona el Fallback

La app intenta usar los LLMs en ESTE ORDEN:

```
1. GROQ          (Más rápido, gratis)
   ↓ (si falla)
2. OPENAI        (Mejor calidad, pago)
   ↓ (si falla)
3. GEMINI        (Barato, gratis)
   ↓ (si falla)
4. LLAMA         (Barato, excelente)
   ↓ (si falla)
5. ANTHROPIC, DEEPSEEK, PERPLEXITY
```

**Ventaja:** Si Groq funciona, NO gastarás dinero. OpenAI solo se usa de fallback.

---

## 🤖 Recomendación: Mejor Setup para MVP

```bash
# .env.local
GROQ_API_KEY=...              # Gratis (principal)
OPENAI_API_KEY=...            # Fallback (tienes costo)
GEMINI_API_KEY=...            # Fallback gratuito (opcional)
TOGETHER_API_KEY=...          # Fallback gratuito (opcional)
```

**Total de costo:** $0 + costo de OpenAI solo si Groq falla

---

## ✅ TODO: Pronto

- [ ] Agregar soporte para Anthropic
- [ ] Agregar soporte para Deepseek
- [ ] Agregar soporte para Perplexity
- [ ] Añadir configuración de prompts por proveedor
- [ ] Monitoreo de uso por proveedor
- [ ] Fallback inteligente (by error type)
