from flask import Blueprint, request, jsonify
from src.db import conectar

curso_bp = Blueprint("curso_bp", __name__)

@curso_bp.route("/cursos", methods=["GET"])
def listar_cursos():
    """
    Listar cursos com possibilidade de filtragem e ordenação.
    Filtros possíveis: area, nivel, avaliacao, acessos, tempo
    Ordenação: ordem (ex: ordem=avaliacao), sentido (asc/desc)
    Exemplo: /api/cursos?area=Programação&nivel=Iniciante&ordem=avaliacao&sentido=desc
    """
    area = request.args.get("area")
    nivel = request.args.get("nivel")
    avaliacao = request.args.get("avaliacao")
    acessos = request.args.get("acessos")
    tempo = request.args.get("tempo")
    # Ordenação
    ordem = request.args.get("ordem")  # Ex: "avaliacao", "acessos", "tempo"
    sentido = request.args.get("sentido", "desc")  # "asc" ou "desc"

    query = "SELECT * FROM cursos WHERE 1=1"
    params = []

    # Filtros dinâmicos
    if area:
        query += " AND area = %s"
        params.append(area)
    if nivel:
        query += " AND nivel = %s"
        params.append(nivel)
    if avaliacao:
        query += " AND avaliacao = %s"
        params.append(avaliacao)
    if acessos:
        query += " AND acessos = %s"
        params.append(acessos)
    if tempo:
        query += " AND tempo = %s"
        params.append(tempo)

    # Ordenação (se informado e seguro)
    campos_validos = ["id", "titulo", "avaliacao", "acessos", "tempo", "area", "nivel"]
    if ordem and ordem in campos_validos:
        sentido = "desc" if sentido.lower() == "desc" else "asc"
        query += f" ORDER BY {ordem} {sentido}"

    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, tuple(params))
    cursos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(cursos)

@curso_bp.route("/cursos", methods=["POST"])
def criar_curso():
    data = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    query = """
        INSERT INTO cursos (titulo, avaliacao, acessos, tempo, area, nivel)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        data["titulo"],
        data["avaliacao"],
        data["acessos"],
        data["tempo"],
        data["area"],
        data["nivel"]
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensagem": "Curso criado com sucesso"}), 201

@curso_bp.route("/cursos/<int:curso_id>", methods=["PUT"])
def atualizar_curso(curso_id):
    data = request.get_json()
    conn = conectar()
    cursor = conn.cursor()
    query = """
        UPDATE cursos
        SET titulo=%s, avaliacao=%s, acessos=%s, tempo=%s, area=%s, nivel=%s
        WHERE id=%s
    """
    cursor.execute(query, (
        data["titulo"],
        data["avaliacao"],
        data["acessos"],
        data["tempo"],
        data["area"],
        data["nivel"],
        curso_id
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensagem": "Curso atualizado com sucesso"})

@curso_bp.route("/cursos/<int:curso_id>", methods=["DELETE"])
def excluir_curso(curso_id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cursos WHERE id=%s", (curso_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"mensagem": "Curso excluído com sucesso"})
