# Configuración de API Keys para LLM

## Problema: "[FALLBACK] Todos los proveedores fallaron"

Este error significa que **no hay ninguna API key válida configurada** en las variables de entorno.

## Solución Rápida

### 1. Para Desarrollo Local

1. Abre tu archivo `.env.local` en la raíz del proyecto
2. Agrega **AL MENOS UNA** de estas líneas con tu API key real:

```env
# Opción más recomendada (tier gratuito generoso):
LLM_API_KEY_GEMINI=AIzaSy...tu-key-aqui...

# Otras opciones (reemplaza con tu API key):
LLM_API_KEY_OPENAI=sk-proj-...tu-key-aqui...
LLM_API_KEY_DEEPSEEK=sk-...tu-key-aqui...
LLM_API_KEY_ANTHROPIC=sk-ant-...tu-key-aqui...
LLM_API_KEY_PERPLEXITY=pplx-...tu-key-aqui...
```

3. Guarda el archivo
4. **IMPORTANTE**: Reinicia tu servidor de desarrollo:
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

### 2. Para Producción en Vercel

1. Ve a tu proyecto en **Vercel Dashboard**
2. Settings → **Environment Variables**
3. Agrega la variable con el nombre **EXACTO**:
   - Name: `LLM_API_KEY_GEMINI`
   - Value: `AIzaSy...tu-key-real`
   - Environment: `Production`, `Preview`, `Development`
4. Haz un **Redeploy**

## Obtener API Keys Gratuitas

### ✅ Gemini (Google) - RECOMENDADO
- **URL**: https://aistudio.google.com/app/apikey
- **Tier Gratuito**: Sí, muy generoso
- **Variable**: `LLM_API_KEY_GEMINI`

### OpenAI
- **URL**: https://platform.openai.com/api-keys
- **Tier Gratuito**: $5 de crédito inicial
- **Variable**: `LLM_API_KEY_OPENAI`

### DeepSeek
- **URL**: https://platform.deepseek.com/
- **Tier Gratuito**: Limitado
- **Variable**: `LLM_API_KEY_DEEPSEEK`

### Anthropic (Claude)
- **URL**: https://console.anthropic.com/
- **Tier Gratuito**: No (requiere tarjeta)
- **Variable**: `LLM_API_KEY_ANTHROPIC`

### Perplexity
- **URL**: https://www.perplexity.ai/
- **Tier Gratuito**: No (requiere tarjeta)
- **Variable**: `LLM_API_KEY_PERPLEXITY`

## Nombres de Variables Soportados

El código acepta múltiples nombres por compatibilidad:

| Proveedor | Nombres Aceptados |
|-----------|-------------------|
| Gemini | `LLM_API_KEY_GEMINI`, `GOOGLE_API_KEY`, `GEMINI_API_KEY` |
| OpenAI | `LLM_API_KEY_OPENAI`, `OPENAI_API_KEY` |
| DeepSeek | `LLM_API_KEY_DEEPSEEK`, `DEEPSEEK_API_KEY` |
| Anthropic | `LLM_API_KEY_ANTHROPIC`, `ANTHROPIC_API_KEY` |
| Perplexity | `LLM_API_KEY_PERPLEXITY`, `PERPLEXITY_API_KEY` |

**Recomendación**: Usa siempre la forma `LLM_API_KEY_*` para consistencia.

## Orden de Fallback Automático

Si configuras múltiples providers, el sistema intentará en este orden:
1. **Gemini** (prioridad por créditos disponibles)
2. **OpenAI**
3. **DeepSeek**
4. **Anthropic**
5. **Perplexity**

Si una falla, automáticamente intenta la siguiente.

## Verificar que las Keys se Leen Correctamente

### Endpoint de test

```bash
curl http://localhost:3000/api/test-llm
```

Deberías ver:
```json
{
  "status": "ok",
  "llmAvailable": true,
  "providers": {
    "gemini": true,
    "openai": false,
    "deepseek": false,
    "anthropic": false,
    "perplexity": false
  }
}
```

### Logs de Consola

En el servidor de desarrollo (npm run dev), deberías ver logs como:
```
[API /generate] LLM environment check: { hasAnyKey: true, gemini: true, openai: false, ... }
[LLM Router] Trying provider: gemini
[LLM Router] Provider gemini succeeded with latency_ms 1234
```

## Troubleshooting

### El error persiste después de agregar la key

1. ✅ **Verifica que reiniciaste el servidor**
   ```bash
   # En terminal: Ctrl+C para detener
   npm run dev  # Reinicia
   ```

2. ✅ **Verifica el nombre exacto de la variable** (case-sensitive)
   - Debe ser `LLM_API_KEY_GEMINI` (no `LLM_api_key_gemini`)

3. ✅ **Verifica que no haya espacios al inicio/final del valor**
   - `LLM_API_KEY_GEMINI=AIzaSy...` ✓
   - `LLM_API_KEY_GEMINI= AIzaSy...` ✗ (espacio)

4. ✅ **Prueba el endpoint de test**
   ```bash
   curl http://localhost:3000/api/test-llm
   ```

### La key es válida pero falla al generar

1. Verifica que la key tenga **créditos disponibles** en la plataforma
2. Verifica los **logs de la consola** del servidor
3. Intenta con otro provider como fallback
4. Verifica que el **token no haya expirado**

### En Vercel funciona localmente pero no en producción

1. Verifica que **agregaste las variables en Vercel Dashboard**
2. Verifica que **seleccionaste los entornos correctos** (Production, Preview, Development)
3. Haz un **redeploy completo** después de agregar variables
4. Espera 1-2 minutos para que los cambios se propaguen

## Logs para Debug

Cuando tengas problemas, busca estos logs en la consola:

```
[API /generate] LLM environment check:  ← Muestra qué keys están configuradas
[LLM Router] Checking provider: ...     ← Intenta cada proveedor
[LLM Router] Provider ... succeeded     ← Éxito
[LLM Router] Provider ... failed        ← Falló, intenta siguiente
```

## Seguridad

⚠️ **IMPORTANTE**:
- **Nunca** commitees `.env.local` a Git (está en `.gitignore`)
- **Nunca** expongas tus API keys en repositorios públicos
- Las variables de Vercel no se muestran en Git, son seguras
- Si accidentalmente expusiste una key, **regenerala inmediatamente** en la plataforma

## Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- Código del router: `app/api/generate/route.ts`
- Código de test: `app/api/test-llm/route.ts`
