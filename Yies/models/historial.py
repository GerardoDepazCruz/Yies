from db import Database
from datetime import datetime

class Historial:
    def __init__(self):
        self.db = Database()

    def registrar_visualizacion(self, usuario_id, contenido_id):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = "INSERT INTO visualizaciones (usuario_id, contenido_id, fecha_visualizacion) VALUES (%s, %s, %s)"
        fecha = datetime.now()
        cursor.execute(query, (usuario_id, contenido_id, fecha))
        conn.commit()
        cursor.close()
        self.db.desconectar()

    def obtener_historial(self, usuario_id, limit=100):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT v.id AS visualizacion_id, v.fecha_visualizacion, c.id AS contenido_id, c.titulo, c.descripcion, c.tipo, c.url_video
        FROM visualizaciones v
        JOIN contenido c ON v.contenido_id = c.id
        WHERE v.usuario_id = %s
        ORDER BY v.fecha_visualizacion DESC
        LIMIT %s
        """
        cursor.execute(query, (usuario_id, limit))
        resultados = cursor.fetchall()
        cursor.close()
        self.db.desconectar()
        return resultados

    def crear_o_actualizar_valoracion(self, usuario_id, contenido_id, calificacion, comentario=None):
        conn = self.db.conectar()
        cursor = conn.cursor()
        fecha = datetime.now()
        # Intentar actualizar si existe
        update_q = """
        UPDATE valoraciones
        SET calificacion=%s, comentario=%s, fecha=%s
        WHERE usuario_id=%s AND contenido_id=%s
        """
        cursor.execute(update_q, (calificacion, comentario, fecha, usuario_id, contenido_id))
        if cursor.rowcount == 0:
            insert_q = """
            INSERT INTO valoraciones (usuario_id, contenido_id, calificacion, comentario, fecha)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_q, (usuario_id, contenido_id, calificacion, comentario, fecha))
        conn.commit()
        cursor.close()
        self.db.desconectar()

    def obtener_valoracion(self, usuario_id, contenido_id):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, calificacion, comentario, fecha FROM valoraciones WHERE usuario_id=%s AND contenido_id=%s"
        cursor.execute(query, (usuario_id, contenido_id))
        valor = cursor.fetchone()
        cursor.close()
        self.db.desconectar()
        return valor

    def borrar_valoracion(self, usuario_id, contenido_id):
        conn = self.db.conectar()
        cursor = conn.cursor()
        query = "DELETE FROM valoraciones WHERE usuario_id=%s AND contenido_id=%s"
        cursor.execute(query, (usuario_id, contenido_id))
        conn.commit()
        affected = cursor.rowcount
        cursor.close()
        self.db.desconectar()
        return affected > 0

    def obtener_valoraciones_contenido(self, contenido_id, limit=50):
        conn = self.db.conectar()
        cursor = conn.cursor(dictionary=True)
        avg_q = "SELECT COUNT(*) AS total, AVG(calificacion) AS promedio FROM valoraciones WHERE contenido_id=%s"
        cursor.execute(avg_q, (contenido_id,))
        resumen = cursor.fetchone()
        list_q = """
        SELECT v.id, v.usuario_id, v.calificacion, v.comentario, v.fecha, u.nombre AS usuario_nombre
        FROM valoraciones v
        LEFT JOIN usuarios u ON v.usuario_id = u.id
        WHERE v.contenido_id=%s
        ORDER BY v.fecha DESC
        LIMIT %s
        """
        cursor.execute(list_q, (contenido_id, limit))
        lista = cursor.fetchall()
        cursor.close()
        self.db.desconectar()
        return {'resumen': resumen, 'lista': lista}
