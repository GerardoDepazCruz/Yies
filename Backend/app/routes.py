from flask import Blueprint, request, jsonify, current_app
from .models import User, Profile
from . import db
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Crear un Blueprint para agrupar las rutas de la API
api_bp = Blueprint('api', __name__, url_prefix='/api')

def token_required(f):
    """Decorador para proteger rutas que requieren un token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    """Decorador para proteger rutas que requieren rol de administrador."""
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'message': 'Cannot perform that function! Admin role required.'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@api_bp.route('/register', methods=['POST'])
def register_user():
    """Endpoint para registrar un nuevo usuario."""
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required!'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 409

    name = data.get('name')

    new_user = User(email=data['email'])
    new_user.set_password(data['password'])

    # El primer usuario registrado será admin
    if User.query.count() == 0:
        new_user.role = 'admin'

    db.session.add(new_user)

    # Si se proporcionó un nombre, crear un Profile asociado
    if name:
        profile = Profile(name=name, avatar_url=None)
        new_user.profiles.append(profile)
        db.session.add(profile)

    db.session.commit()

    return jsonify({'message': 'New user created!'}), 201

@api_bp.route('/login', methods=['POST'])
def login_user():
    """Endpoint para iniciar sesión y obtener un token."""
    auth = request.get_json()
    if not auth or not auth.get('email') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    user = User.query.filter_by(email=auth['email']).first()

    if not user or not user.check_password(auth['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Generar el token JWT
    token = jwt.encode({
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=24) # Token válido por 24 horas
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    # Devolver también información básica del usuario para que el frontend tenga nombre/email
    try:
        user_info = user.to_dict()
    except Exception:
        user_info = {"id": user.id, "email": user.email, "role": user.role}

    return jsonify({'token': token, 'user': user_info})

@api_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    """Endpoint de ejemplo para obtener todos los usuarios (solo para admins)."""
    users = User.query.all()
    output = [user.to_dict() for user in users]
    return jsonify({'users': output})

@api_bp.route('/')
def index():
    return jsonify({"message": "API del Backend de Yies está funcionando!"})