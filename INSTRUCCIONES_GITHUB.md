# 📤 Instrucciones Rápidas para Subir a GitHub

## Paso 1: Inicializar Git

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd /Users/giannioliva/Desktop/alquilercordoba
git init
```

## Paso 2: Agregar archivos

```bash
git add .
```

## Paso 3: Hacer commit

```bash
git commit -m "Initial commit: Alquiler Córdoba"
```

## Paso 4: Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en el botón **"+"** (arriba a la derecha) > **"New repository"**
3. Nombre: `alquilercordoba` (o el que prefieras)
4. Descripción: "Aplicación de alquileres temporarios en Córdoba"
5. Elige **Public** o **Private**
6. **NO marques** "Add a README file" (ya tienes uno)
7. Haz clic en **"Create repository"**

## Paso 5: Conectar y subir

GitHub te mostrará una página con comandos. Ejecuta estos (reemplaza TU_USUARIO con tu usuario de GitHub):

```bash
git remote add origin https://github.com/TU_USUARIO/alquilercordoba.git
git branch -M main
git push -u origin main
```

Si GitHub te pide autenticación, usa un **Personal Access Token** en lugar de tu contraseña.

---

## 🔑 Crear Personal Access Token (si es necesario)

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Nombre: "Mi PC"
4. Selecciona: `repo` (full control)
5. Generate token
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como contraseña cuando Git te la pida

---

¡Listo! Tu código estará en GitHub. Luego sigue las instrucciones en `DEPLOY.md` para deployar en Vercel.



