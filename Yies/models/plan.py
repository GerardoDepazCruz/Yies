from db import Database

class Plan:
    def __init__(self):
        self.db = Database()

    def obtener_todos(self):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM planes")
        resultados = cursor.fetchall()
        cursor.close()
        self.db.desconectar()
        return resultados

    # Método de creación o actualización según se requiera se puede agregar aquí
