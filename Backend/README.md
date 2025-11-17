# Backend - Yies Streaming

Este directorio contiene la API backend en Flask para la aplicación Yies.

Objetivos:
- Proveer endpoints para registro, login y gestión básica de usuarios.
- Conectar con una base de datos MySQL llamada `yies_streaming`.

Requisitos
- Python 3.10+ instalado
- MySQL (servidor) accesible

Instalación (Windows - PowerShell)

1. Abrir PowerShell en la carpeta `Backend`.

2. Crear e (opcional) activar un entorno virtual (recomendado):

```powershell
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
```

3. Instalar dependencias:

```powershell
python -m pip install -r requirements.txt
```

Configuración de variables de entorno

Edite el archivo `.env` en esta carpeta y configure al menos:

- `DATABASE_URL`: la URL de conexión a MySQL en formato SQLAlchemy.
	Ejemplo (si tu usuario es `root`, contraseña `miPass`, host `localhost`):

```
DATABASE_URL="mysql+mysqlconnector://root:miPass@localhost/yies_streaming"
SECRET_KEY="una-cadena-larga-y-segura-para-firmar-tokens"
```

IMPORTANTE: Si la contraseña contiene caracteres especiales (por ejemplo `*`, `@`, `/`), debes percent-encodearlos. Ejemplo: `*` -> `%2A`.

Crear la base de datos (MySQL)

Si aún no creaste la base de datos `yies_streaming`, conéctate a MySQL (MySQL CLI o Workbench) y ejecuta:

```sql
CREATE DATABASE yies_streaming CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Arrancar la aplicación

```powershell
# En la carpeta Backend y con el virtualenv activado (opcional)
python run.py
```

La API quedará disponible en `http://127.0.0.1:5000`.

Endpoints principales

- `POST /api/register` - Registrar usuario
	- Body JSON: `{ "email": "ejemplo@dominio.com", "password": "tuPass" }`
	- Respuestas: `201` (creado), `409` (ya existe), `400` (petición inválida)

- `POST /api/login` - Login
	- Body JSON: `{ "email": "ejemplo@dominio.com", "password": "tuPass" }`
	- Respuesta exitosa: `{ "token": "<JWT>" }`

- `GET /api/users` - Lista de usuarios (solo Admin)
	- Requiere cabecera `x-access-token: <JWT>` con token de administrador

Probar endpoints desde PowerShell

Registrar un usuario:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:5000/api/register -Method POST -Body (@{ email='test@example.com'; password='mipass' } | ConvertTo-Json) -ContentType 'application/json'
```

Iniciar sesión (obtén token):

```powershell
$response = Invoke-RestMethod -Uri http://127.0.0.1:5000/api/login -Method POST -Body (@{ email='test@example.com'; password='mipass' } | ConvertTo-Json) -ContentType 'application/json'
$token = $response.token
```

Usar token para acceder a ruta protegida:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:5000/api/users -Method GET -Headers @{ 'x-access-token' = $token }
```

Probar con curl (alternativa):

```powershell
curl.exe -X POST http://127.0.0.1:5000/api/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"mipass\"}"
```

Ver tablas creadas por SQLAlchemy

En caso de dudas si las tablas fueron creadas:

```powershell
python - <<'PY'
from app import create_app, db
app = create_app()
with app.app_context():
		print(db.inspect(db.engine).get_table_names())
PY
```

Conectar el Frontend

En el frontend ya se preparó `AuthContext` para usar la API en `http://127.0.0.1:5000`.

- Registro: `POST /api/register`
- Login: `POST /api/login` (devuelve token JWT)

El frontend guarda el token en `localStorage` con la clave `yies_token`.
