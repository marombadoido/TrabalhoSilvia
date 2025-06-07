from src.db import conectar
from src.merge_sort import merge_sort

def buscar_cursos(area=None, nivel=None):
    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM cursos WHERE 1=1"
    params = []

    if area:
        query += " AND area = %s"
        params.append(area)
    if nivel:
        query += " AND nivel = %s"
        params.append(nivel)

    cursor.execute(query, params)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return resultados

def recomendar(area=None, nivel=None, criterio="avaliacao"):
    cursos = buscar_cursos(area, nivel)
    return merge_sort(cursos, criterio)


from flask import Blueprint, jsonify, request

benchmark_bp = Blueprint('benchmark', __name__)

@benchmark_bp.route('/benchmark', methods=['GET'])
def benchmark():
    from .recomendador import buscar_cursos, merge_sort
    import time

    cursos = buscar_cursos()
    criterio = request.args.get('criterio', 'avaliacao')

    # Merge Sort
    t1 = time.time()
    merge_result = merge_sort(cursos.copy(), criterio)
    t2 = time.time()

    # Sort nativo
    t3 = time.time()
    sort_nativo = sorted(cursos.copy(), key=lambda x: x[criterio])
    t4 = time.time()

    return jsonify({
        "Merge Sort (s)": round(t2 - t1, 6),
        "Sort Nativo (s)": round(t4 - t3, 6)
    })
