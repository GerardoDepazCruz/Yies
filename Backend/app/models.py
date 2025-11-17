from . import db, bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    profiles = db.relationship('Profile', backref='user', lazy=True, cascade="all, delete-orphan")
    subscription = db.relationship('Subscription', backref='user', uselist=False, cascade="all, delete-orphan")

    def set_password(self, password):
        """Genera el hash de la contraseña y lo guarda."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Verifica si la contraseña proporcionada coincide con el hash."""
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convierte el objeto User a un diccionario para respuestas JSON."""
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "creation_date": self.creation_date.isoformat()
        }

# (El resto de los modelos permanecen igual que antes)
class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    avatar_url = db.Column(db.String(255), nullable=True)
    viewing_history = db.relationship('ViewingHistory', backref='profile', lazy=True, cascade="all, delete-orphan")

class Plan(db.Model):
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quality = db.Column(db.String(50), nullable=False) # Ej: 'HD', '4K'

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='active') # 'active', 'cancelled', 'expired'
    payments = db.relationship('Payment', backref='subscription', lazy=True)

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscriptions.id'), nullable=False)
    payment_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='completed') # 'completed', 'failed'

class Movie(db.Model):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    release_year = db.Column(db.Integer, nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    poster_url = db.Column(db.String(255), nullable=True)

class ViewingHistory(db.Model):
    __tablename__ = 'viewing_history'
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    viewed_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)