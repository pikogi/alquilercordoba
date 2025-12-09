# Alquiler Córdoba

Aplicación web para gestión de alquileres temporarios en Córdoba, Argentina.

## Tecnologías

- Frontend: React + Vite
- Backend: Node.js + Express + SQLite
- UI: Tailwind CSS + shadcn/ui

## Instalación y Uso

### Frontend

```bash
npm install
npm run dev
```

El frontend se ejecutará en http://localhost:5175

### Backend

```bash
cd backend
npm install
npm run dev
```

El backend se ejecutará en http://localhost:3001

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto frontend:

```env
VITE_API_URL=http://localhost:3001/api
```

Crea un archivo `.env` en la carpeta `backend`:

```env
PORT=3001
JWT_SECRET=tu-clave-secreta-super-segura-cambiala-en-produccion
FRONTEND_URL=http://localhost:5175
```

## Usuario por Defecto

El sistema crea un usuario administrador por defecto:
- Email: `admin@example.com`
- Password: `admin123`

**¡IMPORTANTE!** Cambia esta contraseña en producción.

## Construcción para Producción

```bash
npm run build
```