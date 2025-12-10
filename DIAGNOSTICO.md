# 🔍 Diagnóstico: Problemas de Conexión

## Verificaciones a hacer:

### 1. ¿El backend está corriendo?

Abre una terminal y ejecuta:
```bash
cd backend
npm run dev
```

Deberías ver:
```
Server running on http://localhost:3001
Connected to SQLite database
```

### 2. ¿El frontend está conectado al backend correcto?

Abre la consola del navegador (F12) y revisa si hay errores al cargar la página.

### 3. Verificar en el navegador:

1. Abre http://localhost:5175
2. Presiona F12 para abrir las herramientas de desarrollador
3. Ve a la pestaña **"Console"**
4. Ve a la pestaña **"Network"**
5. Recarga la página
6. Busca llamadas a `http://localhost:3001/api/properties`

### 4. Probar directamente el backend:

Abre otra terminal y ejecuta:
```bash
curl http://localhost:3001/api/properties
```

Deberías ver un JSON con las propiedades.

### 5. Verificar usuarios en la base de datos:

```bash
cd backend
sqlite3 database.sqlite "SELECT email, role FROM users;"
```

Deberías ver:
- admin@example.com
- propietario@example.com

### 6. Probar login directamente:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## Problemas comunes y soluciones:

### Error: "Network error" o "Failed to fetch"
- **Causa:** El backend no está corriendo
- **Solución:** Inicia el backend con `cd backend && npm run dev`

### Error: "CORS error"
- **Causa:** El backend está bloqueando tu origen
- **Solución:** Verifica que estés accediendo desde `http://localhost:5175` (no otro puerto)

### Las propiedades no aparecen
- **Causa:** Error al cargar datos
- **Solución:** Revisa la consola del navegador (F12) para ver el error exacto

### No puedo iniciar sesión
- **Causa:** Credenciales incorrectas o backend no responde
- **Solución:** 
  1. Verifica que el backend esté corriendo
  2. Usa: `admin@example.com` / `admin123`
  3. O: `propietario@example.com` / `password123`


