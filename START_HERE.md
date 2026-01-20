# 🚀 START HERE: Sam-app Funcional en 10 Minutos

**TÚ LLEGAS AQUÍ, CONFIGURAS, Y FUNCIONA.** Sin dinero. Ya.

---

## PASO 1: Obtener API Key de Groq (3 minutos)

### 1.1 Ve a Groq
```
https://console.groq.com/keys
```

### 1.2 Registrate (sin tarjeta de crédito)
- Click en "Sign Up"
- Gmail / GitHub
- Confirma tu email
- ¡Listo!

### 1.3 Copia tu API key
- En la página de keys, verás: `gsk_xxxxxxxxxxxxxxxx`
- Cópialo (botón clipboard)

---

## PASO 2: Agregar la Key a tu proyecto (2 minutos)

### 2.1 Abre `.env.local`
```bash
# En la raíz de tu proyecto, abre:
.env.local
```

### 2.2 Agrega esta línea:
```bash
GROQ_API_KEY=tu-key-que-copiaste-aqui
```

### 2.3 Guarda el archivo

---

## PASO 3: Reinicia tu servidor (1 minuto)

```bash
# En terminal, haz:
Ctrl+C  (detén el servidor si está corriendo)

npm run dev
```

Deberías ver:
```
✓ Ready in 1.2s
➜ Local: http://localhost:3000
```

---

## PASO 4: Verifica que funciona (1 minuto)

### Opción A: Test endpoint
Abre en tu navegador:
```
http://localhost:3000/api/groq-test
```

Deberías ver JSON con `"status": "ok"`

### Opción B: Genera contenido
1. Ve a http://localhost:3000
2. Selecciona nivel, asignatura
3. Haz clic en un botón de acción
4. **¡Mágicamente genera contenido en <2 segundos!**

---

## ¿Qué hace ahora?

✅ **Funciona completamente**:
- Crea planificaciones de clase
- Genera evaluaciones
- Propone actividades
- Todo GRATIS sin dinero

✅ **Límites gratuitos**:
- 30 requests por minuto
- Suficiente para MVP
- Sin costo
- Sin tarjeta de crédito

---

## Próximos Pasos

### 1. Prueba con maestros (HOY)
```
Llama a 5 maestros locales:
"Prueba esto gratis y dime qué te falta"
```

### 2. Recopila feedback (ESTA SEMANA)
- ¿Qué funciona bien?
- ¿Qué no funciona?
- ¿Qué agregarías?

### 3. Ajusta según feedback (PRÓXIMA SEMANA)
- Mejora prompts
- Corrige bugs
- Añade funcionalidades

### 4. Contacta directores (PRÓXIMAS 2 SEMANAS)
```
"Mi sistema SAM ahorra 10h/mes a tu equipo.
Demostración gratis."
```

---

## Troubleshooting

### "GROQ_API_KEY not found"
```
1. Abre .env.local
2. Verifica que esté: GROQ_API_KEY=tu-key
3. Sin espacios al inicio/final
4. Reinicia npm run dev
```

### "Rate limit exceeded"
```
Significa: >30 requests en 60 segundos
Solución: Espera 1 minuto, reintentar
Para MVP: No debería pasar
```

### "Error de conexión"
```
1. Verifica conexión a internet
2. Abre https://console.groq.com (confirma acceso)
3. Verifica que tu key sea válida (cópiala de nuevo)
```

---

## Documentación Completa

- **Setup detallado**: [GROQ_SETUP.md](./GROQ_SETUP.md)
- **LLM Configuration**: [docs/API_KEYS_SETUP.md](./docs/API_KEYS_SETUP.md)
- **Deployment**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- **Endpoints API**: http://localhost:3000/api/groq-test

---

## ¿Por qué Groq?

| Aspecto | Groq |
|--------|------|
| Costo | $0 |
| Tarjeta de crédito | ❌ No necesaria |
| Setup | 5 minutos |
| Velocidad | <1s por generación |
| Calidad | ⭐⭐⭐⭐⭐ |
| Límite gratuito | 30 req/min |

---

## ¿Listo?

1. ✅ Ve a https://console.groq.com/keys
2. ✅ Copia tu API key
3. ✅ Agrega a `.env.local`
4. ✅ Reinicia `npm run dev`
5. ✅ **Prueba en http://localhost:3000**

**Eso es TODO.** Tu app está lista.

---

## Preguntas?

- Error técnico → Lee [GROQ_SETUP.md](./GROQ_SETUP.md)
- Quiero escalar → Lee documentación de Vercel
- Quiero mejorar prompts → Lee [docs/API_KEYS_SETUP.md](./docs/API_KEYS_SETUP.md)

**Buena suerte.** 🎓
