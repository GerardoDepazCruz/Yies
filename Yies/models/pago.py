from db import Database

class Pago:
    def __init__(self):
        self.db = Database()

    def crear(self, user_id, suscripcion_id, monto, fecha_pago, metodo_pago):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = "INSERT INTO pagos (suscripcion_id, monto, fecha_pago, metodo_pago) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (suscripcion_id, monto, fecha_pago, metodo_pago))
        conn.commit()
        cursor.close()
        self.db.desconectar()
