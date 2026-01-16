# Procedimiento de Rollback Rápido - SAM v6 LLM

## ROLLBACK INSTANTÁNEO (SIN REDEPLOY)

### Situación: LLM está causando problemas en producción
### Tiempo estimado: **30 segundos**

---

## PASO 1: Acceder a Supabase

```
https://supabase.com/dashboard/project/[PROJECT_ID]
```

## PASO 2: SQL Editor

En la barra lateral, ir a:
- SQL Editor → New Query

## PASO 3: Ejecutar SQL de Desactivación

```sql
UPDATE feature_flags 
SET is_enabled = false, 
    updated_at = NOW() 
WHERE feature_name = 'llm_enabled';
```

## PASO 4: Verificar

```sql
SELECT feature_name, is_enabled, updated_at 
FROM feature_flags 
WHERE feature_name = 'llm_enabled';
```

Debe mostrar:
```
feature_name | is_enabled | updated_at
-------------|------------|-------------------------
llm_enabled  | false      | [TIMESTAMP ACTUAL]
```

## PASO 5: Confirmar en Producción

La **próxima request** a `/api/generate` usará automáticamente el STUB.

**NO SE REQUIERE**:
- ❌ Redeploy en Vercel
- ❌ Reinicio de servidor
- ❌ Cambios en código
- ❌ Esperar cache

**Efecto**: Inmediato (< 1 segundo)

---

## REACTIVACIÓN

Cuando el problema esté resuelto:

```sql
UPDATE feature_flags 
SET is_enabled = true, 
    updated_at = NOW() 
WHERE feature_name = 'llm_enabled';
```

---

## VERIFICAR COMPORTAMIENTO

### Con llm_enabled = false
```bash
curl -X POST https://sam-app-mu.vercel.app/api/generate \
  -H "Cookie: sb-token=[TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "mode": "basic"}' | jq '.llmUsed'
```

**Resultado esperado**: `false`

### Con llm_enabled = true
```bash
curl -X POST https://sam-app-mu.vercel.app/api/generate \
  -H "Cookie: sb-token=[TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "mode": "basic"}' | jq '.llmUsed'
```

**Resultado esperado**: `true` (si LLM_API_KEY está configurada)

---

## MONITOREO POST-ROLLBACK

```sql
-- Ver últimas 10 generaciones
SELECT 
  request_id,
  user_id,
  mode,
  CASE 
    WHEN material LIKE '[STUB]%' THEN 'stub'
    WHEN material LIKE '[FALLBACK]%' THEN 'fallback'
    ELSE 'llm'
  END as source,
  created_at
FROM generated_materials
ORDER BY created_at DESC
LIMIT 10;
```

Después del rollback, todas las nuevas generaciones deben mostrar `source = 'stub'`.

---

## CONTACTO DE EMERGENCIA

- **Tech Lead**: Comet
- **Repositorio**: https://github.com/CarlosVergaraChile/Sam-app
- **Documentación completa**: `/docs/LLM_INTEGRATION_REPORT.md`

---

**Última actualización**: 16 de enero de 2026
