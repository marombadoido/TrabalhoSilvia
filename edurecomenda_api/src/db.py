import mysql.connector

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",           # Substitua se necessário
        password="1148",           # Substitua se necessário
        database="edurecomenda"
    )
