import React, { useState, useEffect } from "react";
import axios from "axios";

// Ajuste a URL se necessário
const API_URL = "http://localhost:5000/api/cursos";
const BENCHMARK_URL = "http://localhost:5000/api/benchmark";

// Áreas e níveis para os selects (ajuste conforme seu banco)
const AREAS = [
  "", "IA", "Programação", "Infraestrutura", "Banco de Dados"
];
const NIVEIS = [
  "", "Iniciante", "Intermediário", "Avançado"
];
const CAMPOS_ORDENACAO = [
  { value: "", label: "Padrão" },
  { value: "avaliacao", label: "Nota" },
  { value: "acessos", label: "Acessos" },
  { value: "tempo", label: "Tempo" }
];

function App() {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    titulo: "", avaliacao: "", acessos: "", tempo: "",
    area: "", nivel: ""
  });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");
  const [filtros, setFiltros] = useState({
    area: "", nivel: "", ordem: "", sentido: "desc"
  });

  // Estado para tempos de benchmark
  const [tempos, setTempos] = useState(null);
  const [erroBenchmark, setErroBenchmark] = useState("");

  // Carregar cursos ao iniciar e quando filtros mudam
  useEffect(() => { buscarCursos(); }, [filtros]);

  // Carregar tempos de ordenação ao iniciar
  useEffect(() => {
    axios.get(BENCHMARK_URL)
      .then(res => setTempos(res.data))
      .catch(() => setErroBenchmark("Não foi possível carregar o tempo de comparação."));
  }, []);

  // Listar todos os cursos (com filtros/ordem)
  const buscarCursos = async () => {
    try {
      const params = {};
      if (filtros.area) params.area = filtros.area;
      if (filtros.nivel) params.nivel = filtros.nivel;
      if (filtros.ordem) params.ordem = filtros.ordem;
      if (filtros.sentido) params.sentido = filtros.sentido;
      const res = await axios.get(API_URL, { params });
      setCursos(res.data);
      setErro("");
    } catch (err) {
      setErro("Erro ao carregar cursos");
    }
  };

  // Preencher formulário para edição
  const editarCurso = (curso) => {
    setForm({
      titulo: curso.titulo,
      avaliacao: curso.avaliacao,
      acessos: curso.acessos,
      tempo: curso.tempo,
      area: curso.area,
      nivel: curso.nivel,
    });
    setEditandoId(curso.id);
  };

  // Atualizar campos do formulário
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submeter formulário (criar ou editar)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.avaliacao) {
      setErro("Preencha o título e avaliação!");
      return;
    }
    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ titulo: "", avaliacao: "", acessos: "", tempo: "", area: "", nivel: "" });
      buscarCursos();
      setErro("");
    } catch (err) {
      setErro("Erro ao salvar curso!");
    }
  };

  // Deletar curso
  const deletarCurso = async (id) => {
    if (window.confirm("Deseja realmente excluir este curso?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        buscarCursos();
      } catch (err) {
        setErro("Erro ao excluir curso!");
      }
    }
  };

  // Estilos simples com CSS-in-JS
  const estilos = {
    container: {
      maxWidth: 1000, margin: "40px auto", background: "#f9fafd",
      padding: 32, borderRadius: 18, boxShadow: "0 2px 16px #0002",
      fontFamily: "Segoe UI, Arial", minHeight: "100vh"
    },
    titulo: {
      fontSize: 34, fontWeight: 700, color: "#2a394f", marginBottom: 18
    },
    filtros: {
      display: "flex", gap: 15, marginBottom: 22, alignItems: "center"
    },
    select: {
      padding: 6, borderRadius: 8, border: "1px solid #bcc3cc",
      fontSize: 16, background: "#fff"
    },
    btn: {
      padding: "7px 18px", border: "none", borderRadius: 10,
      background: "#006df0", color: "#fff", fontWeight: 600,
      cursor: "pointer", transition: ".2s"
    },
    btnDanger: {
      background: "#f22640", marginLeft: 5
    },
    table: {
      width: "100%", borderCollapse: "collapse", background: "#fff",
      borderRadius: 10, overflow: "hidden", marginBottom: 24
    },
    th: {
      background: "#f3f6fa", color: "#2a394f", padding: 10, fontWeight: 700
    },
    td: {
      padding: 10, borderBottom: "1px solid #e9e9e9"
    },
    form: {
      display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 28
    },
    input: {
      padding: 7, borderRadius: 8, border: "1px solid #bcc3cc", fontSize: 15, minWidth: 120
    },
    benchmark: {
      background: "#fff7e0", padding: 16, borderRadius: 10, marginBottom: 26,
      boxShadow: "0 1px 8px #ffc10755", maxWidth: 350, marginLeft: "auto", marginRight: "auto",
      border: "1.5px solid #ffe58f", color: "#715c17", textAlign: "center", fontWeight: 500
    }
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.titulo}>EduRecomenda - Gerencie e Filtre Cursos</div>

      {/* Tempos de benchmark */}
      <div style={estilos.benchmark}>
        {erroBenchmark && <span>{erroBenchmark}</span>}
        {!tempos && !erroBenchmark && <span>Calculando tempos de ordenação...</span>}
        {tempos && (
          <div>
            <div>
              <b>Merge Sort:</b> {tempos["Merge Sort (s)"]} segundos
            </div>
            <div>
              <b>Sort Nativo:</b> {tempos["Sort Nativo (s)"]} segundos
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div style={estilos.filtros}>
        <span style={{ fontWeight: 600, color: "#2a394f" }}>Filtrar:</span>
        <select style={estilos.select}
          value={filtros.area}
          onChange={e => setFiltros({ ...filtros, area: e.target.value })}>
          <option value="">Todas áreas</option>
          {AREAS.filter(a => a).map(area =>
            <option value={area} key={area}>{area}</option>
          )}
        </select>
        <select style={estilos.select}
          value={filtros.nivel}
          onChange={e => setFiltros({ ...filtros, nivel: e.target.value })}>
          <option value="">Todos níveis</option>
          {NIVEIS.filter(n => n).map(nivel =>
            <option value={nivel} key={nivel}>{nivel}</option>
          )}
        </select>
        <select style={estilos.select}
          value={filtros.ordem}
          onChange={e => setFiltros({ ...filtros, ordem: e.target.value })}>
          {CAMPOS_ORDENACAO.map(({ value, label }) =>
            <option value={value} key={value}>{label}</option>
          )}
        </select>
        <select style={estilos.select}
          value={filtros.sentido}
          onChange={e => setFiltros({ ...filtros, sentido: e.target.value })}>
          <option value="desc">Maior primeiro</option>
          <option value="asc">Menor primeiro</option>
        </select>
        <button style={estilos.btn} onClick={buscarCursos}>Filtrar</button>
        <button style={{ ...estilos.btn, background: "#a2b3c7" }}
          onClick={() => setFiltros({ area: "", nivel: "", ordem: "", sentido: "desc" })}>
          Limpar
        </button>
      </div>

      {/* Formulário de Curso */}
      <form onSubmit={onSubmit} style={estilos.form}>
        <input name="titulo" placeholder="Título" style={estilos.input}
          value={form.titulo} onChange={onChange} required />
        <input name="avaliacao" type="number" min="0" max="10" step="0.1"
          placeholder="Nota" style={estilos.input}
          value={form.avaliacao} onChange={onChange} required />
        <input name="acessos" type="number" min="0"
          placeholder="Acessos" style={estilos.input}
          value={form.acessos} onChange={onChange} />
        <input name="tempo" type="number" min="0"
          placeholder="Tempo (min)" style={estilos.input}
          value={form.tempo} onChange={onChange} />
        <select name="area" style={estilos.input}
          value={form.area} onChange={onChange} required>
          <option value="">Área</option>
          {AREAS.filter(a => a).map(area =>
            <option value={area} key={area}>{area}</option>
          )}
        </select>
        <select name="nivel" style={estilos.input}
          value={form.nivel} onChange={onChange} required>
          <option value="">Nível</option>
          {NIVEIS.filter(n => n).map(nivel =>
            <option value={nivel} key={nivel}>{nivel}</option>
          )}
        </select>
        <button type="submit" style={estilos.btn}>
          {editandoId ? "Salvar" : "Adicionar"}
        </button>
        {editandoId &&
          <button type="button" style={{ ...estilos.btn, background: "#a2b3c7" }}
            onClick={() => { setEditandoId(null); setForm({ titulo: "", avaliacao: "", acessos: "", tempo: "", area: "", nivel: "" }); }}>
            Cancelar
          </button>
        }
      </form>

      {/* Mensagens de erro */}
      {erro && <div style={{ color: "red", marginBottom: 16 }}>{erro}</div>}

      {/* Tabela de cursos */}
      <div style={{ overflowX: "auto" }}>
        <table style={estilos.table}>
          <thead>
            <tr>
              <th style={estilos.th}>ID</th>
              <th style={estilos.th}>Título</th>
              <th style={estilos.th}>Nota</th>
              <th style={estilos.th}>Acessos</th>
              <th style={estilos.th}>Tempo</th>
              <th style={estilos.th}>Área</th>
              <th style={estilos.th}>Nível</th>
              <th style={estilos.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.length === 0 && (
              <tr>
                <td colSpan="8" style={{ color: "#888", textAlign: "center" }}>
                  Nenhum curso cadastrado ou filtro sem resultados
                </td>
              </tr>
            )}
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td style={estilos.td}>{curso.id}</td>
                <td style={estilos.td}>{curso.titulo}</td>
                <td style={estilos.td}>{curso.avaliacao}</td>
                <td style={estilos.td}>{curso.acessos}</td>
                <td style={estilos.td}>{curso.tempo}</td>
                <td style={estilos.td}>{curso.area}</td>
                <td style={estilos.td}>{curso.nivel}</td>
                <td style={estilos.td}>
                  <button style={estilos.btn} onClick={() => editarCurso(curso)}>
                    Editar
                  </button>
                  <button style={{ ...estilos.btn, ...estilos.btnDanger }}
                    onClick={() => deletarCurso(curso.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ color: "#7a8ca3", fontSize: 15, textAlign: "center" }}>
        EduRecomenda &copy; 2025 – Filtragem, Ordenação e CRUD integrado
      </div>
    </div>
  );
}

export default App;
