def filtrar_cursos(cursos, area=None, nivel=None):
    """Filtra os cursos com base na área e/ou nível fornecidos."""
    if area:
        cursos = [curso for curso in cursos if curso.get("area") == area]
    if nivel:
        cursos = [curso for curso in cursos if curso.get("nivel") == nivel]
    return cursos
