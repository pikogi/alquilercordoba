# 📖 Guía Paso a Paso - Alquiler Córdoba

## 🚀 Paso 1: Iniciar el Backend

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

**⚠️ IMPORTANTE:** Mantén esta terminal abierta. El backend debe estar corriendo para que la aplicación funcione.

---

## 🎨 Paso 2: Iniciar el Frontend

Abre **OTRA terminal** (no cierres la del backend) y ejecuta:

```bash
npm run dev
```

Deberías ver:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5175/
```

Abre tu navegador en: **http://localhost:5175**

---

## 👀 Paso 3: Ver las Propiedades

1. Abre **http://localhost:5175** en tu navegador
2. Deberías ver la página principal con las propiedades cargadas
3. Si no ves propiedades, verifica que:
   - El backend esté corriendo (Paso 1)
   - Se hayan cargado datos con el script de seeding

---

## 🔐 Paso 4: Iniciar Sesión

Para gestionar propiedades, necesitas iniciar sesión:

1. En la esquina superior derecha, haz clic en **"Iniciar Sesión"**
2. Usa uno de estos usuarios:

   **Opción A - Admin:**
   - Email: `admin@example.com`
   - Contraseña: `admin123`

   **Opción B - Propietario (tiene propiedades):**
   - Email: `propietario@example.com`
   - Contraseña: `password123`

3. Haz clic en **"Iniciar Sesión"**
4. Serás redirigido al **Panel de Propietarios**

---

## ➕ Paso 5: Crear una Nueva Propiedad

### Desde el Panel de Propietarios:

1. **Inicia sesión** (Paso 4)
2. En el Panel, haz clic en el botón **"Nueva Propiedad"** (arriba a la derecha)
3. Completa el formulario:

   **Información Básica:**
   - Título: Ej. "Casa en Villa Carlos Paz"
   - Ubicación: Ej. "Villa Carlos Paz, Córdoba"
   - Descripción: Describe la propiedad
   - Precio por noche: Ej. 20000
   - Capacidad: Número de huéspedes (ej. 4)

   **Imágenes:**
   - **Imagen de Portada**: Haz clic en "Subir Portada" y selecciona una imagen
     - O puedes pegar una URL directamente en el campo
   - **Galería**: Haz clic en el área con el "+" para agregar más imágenes

   **Comodidades:**
   - Marca las casillas de las comodidades que tiene la propiedad

4. Haz clic en **"Guardar Propiedad"**
5. ¡Listo! La propiedad aparecerá en tu panel y en la página principal

---

## 📝 Paso 6: Editar una Propiedad Existente

1. Inicia sesión (Paso 4)
2. Ve al **Panel de Propietarios**
3. Encuentra la propiedad que quieres editar
4. Haz clic en el botón **"Editar"** (esquina superior derecha de cada propiedad)
5. Modifica los campos que necesites
6. Haz clic en **"Guardar Propiedad"**

---

## 🗓️ Paso 7: Gestionar Disponibilidad (Calendario)

1. Inicia sesión (Paso 4)
2. Ve al **Panel de Propietarios**
3. En cada propiedad verás un **calendario**
4. Para bloquear una fecha (marcarla como NO disponible):
   - Haz clic en cualquier fecha del calendario
   - La fecha se pondrá oscura (bloqueada)
5. Para desbloquear:
   - Haz clic nuevamente en la fecha oscura
   - Volverá a estar disponible

**Nota:** Solo puedes bloquear/desbloquear fechas futuras, no pasadas.

---

## 🐛 Solución de Problemas

### No veo las propiedades en la página principal

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica en la consola del navegador (F12) si hay errores
3. Ejecuta el script de seeding para cargar datos:
   ```bash
   cd backend
   npm run seed
   ```

### Error "No token provided" o problemas de autenticación

**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. Limpia el localStorage del navegador:
   - Presiona F12
   - Ve a "Application" > "Local Storage"
   - Elimina todas las entradas
   - Recarga la página

### El backend no inicia

**Solución:**
1. Verifica que estés en la carpeta `backend`
2. Verifica que las dependencias estén instaladas:
   ```bash
   cd backend
   npm install
   ```
3. Verifica que el puerto 3001 no esté ocupado

### No puedo subir imágenes

**Solución:**
1. Verifica que estés autenticado (iniciado sesión)
2. Verifica que el backend esté corriendo
3. Las imágenes deben ser JPG, PNG, GIF o WebP
4. El tamaño máximo es 10MB

---

## 📋 Comandos Útiles

### Cargar datos de ejemplo:
```bash
cd backend
npm run seed
```

### Reiniciar la base de datos (⚠️ elimina todos los datos):
```bash
cd backend
rm database.sqlite
npm run seed
```

### Ver propiedades en la base de datos:
```bash
cd backend
sqlite3 database.sqlite "SELECT id, title, location FROM properties;"
```

---

## ✅ Checklist Rápido

- [ ] Backend corriendo en http://localhost:3001
- [ ] Frontend corriendo en http://localhost:5175
- [ ] Puedo ver las propiedades en la página principal
- [ ] Puedo iniciar sesión con un usuario
- [ ] Puedo acceder al Panel de Propietarios
- [ ] Puedo crear una nueva propiedad
- [ ] Puedo editar una propiedad existente
- [ ] Puedo gestionar el calendario de disponibilidad

---

¡Listo! Ya puedes gestionar tus propiedades. Si tienes más preguntas, revisa la consola del navegador (F12) o los logs del backend para más información.

