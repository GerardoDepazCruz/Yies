from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from .config import Config

# Inicialización de extensiones
db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    """Fábrica de aplicaciones para crear la instancia de Flask."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones con la app
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)  # Habilitar CORS para permitir peticiones del frontend

    with app.app_context():
        # Importar modelos para que SQLAlchemy los reconozca
        from . import models
        
        # Registrar las rutas (endpoints) de la API
        from . import routes
        app.register_blueprint(routes.api_bp)

        # Crear todas las tablas de la base de datos si no existen
        db.create_all()

    return app