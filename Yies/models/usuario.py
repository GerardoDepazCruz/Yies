from db import Database

class Usuario:
    def __init__(self):
        self.db = Database()

    def obtener_todos(self):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        # Incluye el campo contrasena para evitar KeyError
        cursor.execute("SELECT id, nombre, correo, contrasena, perfil FROM usuarios WHERE estado=1")
        resultados = cursor.fetchall()
        cursor.close()
        self.db.desconectar()
        return resultados

    def crear(self, nombre, correo, contrasena, perfil, fecha_expiracion):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = "INSERT INTO usuarios (nombre, correo, contrasena, perfil, fecha_expiracion) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (nombre, correo, contrasena, perfil, fecha_expiracion))
        conn.commit()
        cursor.close()
        self.db.desconectar()
