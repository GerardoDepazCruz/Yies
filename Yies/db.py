import mysql.connector

class Database:
    def __init__(self):
        self.config = {
            'host': 'localhost',
            'user': 'Yies',
            'password': 'yies',
            'database': 'yies_streaming'
        }
        self.connection = None

    def conectar(self):
        self.connection = mysql.connector.connect(**self.config)
        return self.connection

    def desconectar(self):
        if self.connection:
            self.connection.close()
