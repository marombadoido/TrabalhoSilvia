from flask import Flask, request, jsonify
from flask_cors import CORS
from api.recomendador import recomendar, benchmark_bp  # importa também o benchmark_bp!
from api.curso_crud import curso_bp  # IMPORTANTE: importa o Blueprint do CRUD

app = Flask(__name__)
CORS(app)

# REGISTRA OS BLUEPRINTS NA API
app.register_blueprint(curso_bp, url_prefix="/api")
app.register_blueprint(benchmark_bp, url_prefix='/api')

@app.route("/api/recomendar", methods=["GET"])
def recomendar_api():
    area = request.args.get("area")
    nivel = request.args.get("nivel")
    criterio = request.args.get("criterio", "avaliacao")
    cursos = recomendar(area=area, nivel=nivel, criterio=criterio)
    return jsonify(cursos)

if __name__ == "__main__":
    print(app.url_map)   # Isso vai mostrar TODAS as rotas registradas, útil para debug!
    app.run(debug=True)
