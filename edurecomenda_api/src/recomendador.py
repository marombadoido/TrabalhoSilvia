from flask import Blueprint, jsonify, request
from .db import conectar
from .merge_sort import merge_sort

# Blueprint para endpoints relacionados a recomendação e benchmark
benchmark_bp = Blueprint('benchmark', __name__)

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

# --- Endpoint de benchmark ---
@benchmark_bp.route('/benchmark', methods=['GET'])
def benchmark():
    import time

    area = request.args.get('area')
    nivel = request.args.get('nivel')
    criterio = request.args.get('criterio', 'avaliacao')

    cursos = buscar_cursos(area, nivel)

    # Teste Merge Sort
    t1 = time.time()
    merge_result = merge_sort(cursos.copy(), criterio)
    t2 = time.time()

    # Teste sort nativo do Python
    t3 = time.time()
    sort_nativo = sorted(cursos.copy(), key=lambda x: x[criterio])
    t4 = time.time()

    return jsonify({
        "Merge Sort (s)": round(t2 - t1, 6),
        "Sort Nativo (s)": round(t4 - t3, 6)
    })
