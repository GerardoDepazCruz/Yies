from db import Database

class Suscripcion:
    def __init__(self):
        self.db = Database()

    def obtener_todos(self):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM suscripciones")
        resultados = cursor.fetchall()
        cursor.close()
        self.db.desconectar()
        return resultados

    def crear(self, usuario_id, plan_id, fecha_inicio, fecha_fin, estado_pago):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = """
        INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado_pago)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (usuario_id, plan_id, fecha_inicio, fecha_fin, estado_pago))
        conn.commit()
        suscripcion_id = cursor.lastrowid  # Obtener ID insertado
        cursor.close()
        self.db.desconectar()
        return suscripcion_id
