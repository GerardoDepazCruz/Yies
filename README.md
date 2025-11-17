# Yies

Yies es una plataforma de streaming (proyecto de práctica) que permite buscar y visualizar información de películas y series, gestionar usuarios y simulaciones de suscripciones. El proyecto está dividido en dos partes:

- Frontend: aplicación React (Vite + Tailwind) para la interfaz de usuario.
- Backend: API en Flask que gestiona usuarios, autenticación y persistencia en MySQL.

## Tecnologías principales

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Python, Flask, Flask-SQLAlchemy, Flask-Bcrypt, PyJWT
- Base de datos: MySQL (schema en `Backend/schema.sql`)

## Estructura del repositorio

```
Yies/
├─ Frontend/        # Código React + instrucciones en Frontend/README.md
├─ Backend/         # API Flask + instrucciones en Backend/README.md
├─ README.md        # Este archivo
```

## Instalación rápida (clonar todo)

1. Clona el repositorio:

```bash
git clone https://github.com/GerardoDepazCruz/Yies.git
cd Yies
```

2. Sigue las instrucciones específicas en los README de cada carpeta:

- Frontend: `Frontend/README.md` — instalar dependencias y ejecutar con `npm run dev`.
- Backend: `Backend/README.md` — crear virtualenv, instalar `requirements.txt`, configurar `.env` y ejecutar `python run.py`.

## Enlaces rápidos (archivos de ayuda)

- Frontend README: `Frontend/README.md`
- Backend README: `Backend/README.md`
- Esquema de la base de datos: `Backend/schema.sql`


