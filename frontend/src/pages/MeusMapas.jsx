import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/MeusMapas.css";

import worldImg from "../assets/map.jpg";

export default function MeusMapas() {
  const navegar = useNavigate();

  const [mapas, setMapas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [nomeNovo, setNomeNovo] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Sua sessão expirou. Faça login novamente.");
      navegar("/login");
      return;
    }
    carregarMapas();
  }, []);

  async function carregarMapas() {
    try {
      setCarregando(true);

      const resp = await fetch("http://localhost:3001/api/mapas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(dados?.erro || "Não foi possível carregar os mapas.");
        return;
      }

      setMapas(Array.isArray(dados) ? dados : []);
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function formatarDataBR(valor) {
    if (!valor) return "-";

    const iso = valor.includes("T") ? valor : valor.replace(" ", "T");
    const d = new Date(iso);

    if (Number.isNaN(d.getTime())) return valor;

    return d.toLocaleDateString("pt-BR");
  }

  function abrirMapa(id) {
    navegar(`/mapa/${id}`);
  }

  async function deletarMapa(id) {
    if (!confirm("Deseja deletar este mapa?")) return;

    try {
      setCarregando(true);

      const resp = await fetch(`http://localhost:3001/api/mapas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(dados?.erro || "Erro ao deletar mapa.");
        return;
      }

      setMapas((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function abrirModal() {
    setNomeNovo("");
    setModalAberto(true);

    setTimeout(() => {
      document.getElementById("meusmapas_modal_input")?.focus();
    }, 0);
  }

  function fecharModal() {
    if (carregando) return;
    setModalAberto(false);
    setNomeNovo("");
  }

  async function criarMapa(e) {
    e.preventDefault();

    const nome = nomeNovo.trim();
    if (!nome) {
      alert("Digite o nome do mapa.");
      return;
    }

    try {
      setCarregando(true);

      const resp = await fetch("http://localhost:3001/api/mapas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome }),
      });

      const dados = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(dados?.erro || "Erro ao criar mapa.");
        return;
      }

      setMapas((prev) => [dados, ...prev]);
      fecharModal();
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="meusmapas">
      <section className="meusmapas_container">
        <aside className="meusmapas_esquerda">
          <img className="meusmapas_img" src={worldImg} alt="Mundo" />

          <button
            className="meusmapas_registrar"
            type="button"
            onClick={abrirModal}
            disabled={carregando}
          >
            Registrar Mapa
          </button>
        </aside>

        <section className="meusmapas_direita">
          <header className="meusmapas_topo">
            <h1 className="meusmapas_titulo">Controle de Mapas</h1>
          </header>

          <div className="meusmapas_tabelaWrapper">
            <table className="meusmapas_tabelaReal">
              <tbody>
                {carregando && mapas.length === 0 && (
                  <tr>
                    <td className="meusmapas_td meusmapas_vazio" colSpan={4}>
                      Carregando...
                    </td>
                  </tr>
                )}

                {!carregando && mapas.length === 0 && (
                  <tr>
                    <td className="meusmapas_td meusmapas_vazio" colSpan={4}>
                      Nenhum mapa criado ainda.
                    </td>
                  </tr>
                )}

                {mapas.map((m) => (
                  <tr key={m.id}>
                    <td className="meusmapas_td">
                      <span className="meusmapas_nome">{m.nome}</span>
                    </td>

                    <td className="meusmapas_td meusmapas_data">
                      {formatarDataBR(m.criado_em)}
                    </td>

                    <td className="meusmapas_td">
                      <span className="meusmapas_pontos">
                        {m.qtd_pontos} pontos registrados
                      </span>
                    </td>

                    <td className="meusmapas_td">
                      <div className="meusmapas_acoes">
                        <button
                          className="meusmapas_acao meusmapas_acaoAcessar"
                          type="button"
                          onClick={() => abrirMapa(m.id)}
                          disabled={carregando}
                        >
                          Acessar
                        </button>

                        <button
                          className="meusmapas_acao meusmapas_acaoDeletar"
                          type="button"
                          onClick={() => deletarMapa(m.id)}
                          disabled={carregando}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {modalAberto && (
        <div className="meusmapas_modal_overlay" onClick={fecharModal}>
          <div
            className="meusmapas_modal_box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="meusmapas_modal_titulo">Registrar mapa</h3>

            <form className="meusmapas_modal_form" onSubmit={criarMapa}>
              <label
                className="meusmapas_modal_label"
                htmlFor="meusmapas_modal_input"
              >
                Nome do mapa
              </label>

              <input
                id="meusmapas_modal_input"
                className="meusmapas_modal_input"
                value={nomeNovo}
                onChange={(e) => setNomeNovo(e.target.value)}
                placeholder="Ex: São Paulo, Minas Gerais..."
                type="text"
              />

              <div className="meusmapas_modal_botoes">
                <button
                  className="meusmapas_modal_btn"
                  type="submit"
                  disabled={carregando}
                >
                  {carregando ? "Salvando..." : "Confirmar"}
                </button>

                <button
                  className="meusmapas_modal_btnGhost"
                  type="button"
                  onClick={fecharModal}
                  disabled={carregando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
