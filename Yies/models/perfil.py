from db import Database

class Perfil:
    def __init__(self):
        self.db = Database()

    def crear_perfil(self, usuario_id, nombre_perfil, pin):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = "INSERT INTO perfiles (usuario_id, nombre_perfil, pin) VALUES (%s, %s, %s)"
        cursor.execute(query, (usuario_id, nombre_perfil, pin))
        conn.commit()
        cursor.close()
        self.db.desconectar()

    def obtener_perfiles(self, usuario_id):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, nombre_perfil FROM perfiles WHERE usuario_id=%s"
        cursor.execute(query, (usuario_id,))
        perfiles = cursor.fetchall()
        cursor.close()
        self.db.desconectar()
        return perfiles

    def validar_pin(self, perfil_id, pin):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = "SELECT COUNT(*) FROM perfiles WHERE id=%s AND pin=%s"
        cursor.execute(query, (perfil_id, pin))
        resultado = cursor.fetchone()
        cursor.close()
        self.db.desconectar()
        return resultado[0] == 1
