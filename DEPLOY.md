# 🚀 Guía de Deployment - Alquiler Córdoba

Esta guía te ayudará a subir tu proyecto a GitHub y deployarlo en Vercel.

---

## 📋 Paso 1: Preparar el Proyecto

### 1.1 Verificar archivos importantes

Asegúrate de tener estos archivos:
- ✅ `.gitignore` (ya configurado)
- ✅ `package.json` con scripts de build
- ✅ Variables de entorno configuradas

---

## 📦 Paso 2: Inicializar Git y Subir a GitHub

### 2.1 Inicializar el repositorio Git

```bash
cd /Users/giannioliva/Desktop/alquilercordoba
git init
```

### 2.2 Agregar todos los archivos

```bash
git add .
```

### 2.3 Hacer el primer commit

```bash
git commit -m "Initial commit: Alquiler Córdoba app"
```

### 2.4 Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"** (o el botón **"+"** > **"New repository"**)
3. Nombre del repositorio: `alquilercordoba` (o el que prefieras)
4. **NO** marques "Initialize with README" (ya tienes archivos)
5. Haz clic en **"Create repository"**

### 2.5 Conectar y subir a GitHub

GitHub te mostrará comandos similares a estos. Ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/alquilercordoba.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub**

---

## 🔧 Paso 3: Configurar Vercel para el Frontend

### 3.1 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"**
3. Elige **"Continue with GitHub"** (recomendado)

### 3.2 Importar el proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** > **"Project"**
2. Selecciona tu repositorio `alquilercordoba`
3. Configura el proyecto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega:

```
VITE_API_URL=https://tu-backend-url.vercel.app/api
```

**Nota:** Por ahora deja esta URL temporal. La actualizarás cuando deployes el backend.

### 3.4 Deploy

Haz clic en **"Deploy"** y espera a que termine.

---

## ⚙️ Paso 4: Deployar el Backend

**IMPORTANTE:** Vercel funciona bien para frontend, pero para el backend con SQLite y archivos estáticos necesitas una solución diferente.

### Opción A: Deployar Backend en Railway (Recomendado)

Railway es ideal para backends Node.js con bases de datos.

1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta (puedes usar GitHub)
3. Clic en **"New Project"** > **"Deploy from GitHub repo"**
4. Selecciona tu repositorio
5. En la configuración:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. Agrega variables de entorno:
   ```
   PORT=3001
   JWT_SECRET=tu-clave-secreta-super-segura
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```
7. Railway generará una URL para tu backend (ej: `https://tu-app.up.railway.app`)
8. Actualiza `VITE_API_URL` en Vercel con esta nueva URL

### Opción B: Deployar Backend en Render

1. Ve a [render.com](https://render.com)
2. Crea una cuenta
3. Clic en **"New +"** > **"Web Service"**
4. Conecta tu repositorio de GitHub
5. Configuración:
   - **Name**: `alquilercordoba-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
6. Agrega variables de entorno
7. Render generará una URL para tu backend

### Opción C: Usar MongoDB Atlas (Para producción)

SQLite no funciona bien en servicios serverless. Para producción, considera migrar a MongoDB Atlas:

1. Crea cuenta en [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Obtén la cadena de conexión
4. Modifica el backend para usar MongoDB en lugar de SQLite

---

## 🔄 Paso 5: Actualizar URLs

Una vez que tengas la URL del backend:

1. Ve a Vercel Dashboard > Tu proyecto > Settings > Environment Variables
2. Actualiza `VITE_API_URL` con la URL real del backend
3. Haz un nuevo deploy (Vercel lo hará automáticamente o puedes forzarlo)

---

## 📝 Paso 6: Configuración Adicional

### Para desarrollo local

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001/api
```

### Para el backend

Crea un archivo `.env` en `backend/`:

```env
PORT=3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-en-produccion
FRONTEND_URL=http://localhost:5175
```

---

## ✅ Checklist Final

- [ ] Proyecto subido a GitHub
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado (Railway/Render)
- [ ] Variables de entorno configuradas
- [ ] URLs actualizadas correctamente
- [ ] Probado que el frontend se conecta al backend

---

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

- Verifica que `VITE_API_URL` esté configurado correctamente
- Asegúrate de que el backend esté corriendo
- Verifica CORS en el backend (debe permitir tu dominio de Vercel)

### Error de CORS

En `backend/src/server.js`, verifica que `FRONTEND_URL` incluya tu dominio de Vercel:

```javascript
origin: process.env.FRONTEND_URL || 'http://localhost:5175'
```

### Imágenes no se muestran

- Las imágenes subidas se guardan en `backend/uploads/`
- En producción, necesitas un servicio de almacenamiento (AWS S3, Cloudinary, etc.)
- Por ahora, puedes usar URLs externas en el formulario

---

## 📚 Recursos Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Render](https://render.com/docs)

---

¡Listo! Tu aplicación debería estar funcionando en producción. 🎉

