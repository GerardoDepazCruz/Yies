# 🎬 Yies (Frontend)

Este repositorio contiene la parte frontend de la aplicación Yies (React + Vite + Tailwind).

Este README explica cómo levantar el frontend localmente y cómo conectarlo con el backend que corre en `http://127.0.0.1:5000`.

## Requisitos

- Node.js 16+ y npm
- (Opcional) Git
- Backend de la aplicación corriendo (ver `../Backend/README.md`)

## Instalación y ejecución (Windows - PowerShell)

1. Abre PowerShell en la carpeta `Frontend`.

2. Instala dependencias:

```powershell
npm install
```

3. Crea el archivo de entorno `.env` en la raíz del frontend si no existe y añade tu clave de OMDb:

```
VITE_OMDB_API_KEY=tu_api_key_aqui
```

4. Ejecuta el servidor de desarrollo de Vite:

```powershell
npm run dev
```

La app quedará disponible por defecto en `http://localhost:5173`.

## Conexión con el Backend

El frontend ya está preparado para usar la API del backend en `http://127.0.0.1:5000` para registro/login. Asegúrate de haber arrancado el backend primero (revisa `Backend/README.md`).

- Endpoints utilizados desde el frontend:
  - `POST http://127.0.0.1:5000/api/register` — Registrar usuario
  - `POST http://127.0.0.1:5000/api/login` — Iniciar sesión (devuelve token JWT)

El token JWT se guarda en `localStorage` con la clave `yies_token` y el contexto de autenticación (`AuthContext`) lo usa para establecer el estado del usuario.

Si quieres cambiar la URL del backend, busca en el proyecto dónde se usa `http://127.0.0.1:5000` (por ejemplo en `src/context/AuthContext.jsx`) y reemplázala por la URL deseada o por una variable de entorno.

