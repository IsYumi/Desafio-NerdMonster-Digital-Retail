import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/MapaDetalhe.css";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API = "http://localhost:3001/api";

function ClickNoMapa({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function MapaDetalhe() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [mapa, setMapa] = useState(null);
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [latLngSelecionado, setLatLngSelecionado] = useState(null);
  const [nomePonto, setNomePonto] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState("");

  const token = localStorage.getItem("token");

  const headersAuth = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  useEffect(() => {
    if (!token) {
      alert("Sua sessão expirou. Faça login novamente.");
      navegar("/login");
      return;
    }
    carregarTela();
  }, [id]);

  async function carregarTela() {
    try {
      setCarregando(true);

      const rMapa = await fetch(`${API}/mapas/${id}`, { headers: headersAuth });
      const dMapa = await rMapa.json();
      if (!rMapa.ok) {
        alert(dMapa?.erro || "Não foi possível carregar o mapa.");
        return;
      }
      setMapa(dMapa);

      const rPontos = await fetch(`${API}/mapas/${id}/pontos`, { headers: headersAuth });
      const dPontos = await rPontos.json();
      if (!rPontos.ok) {
        alert(dPontos?.erro || "Não foi possível carregar os pontos.");
        return;
      }
      setPontos(dPontos);
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function abrirModalNovoPonto(latlng) {
    setLatLngSelecionado(latlng);
    setNomePonto("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (carregando) return;
    setModalAberto(false);
    setLatLngSelecionado(null);
    setNomePonto("");
  }

  async function confirmarNovoPonto(e) {
    e.preventDefault();
    if (!latLngSelecionado) return;

    const nome = nomePonto.trim();
    if (!nome) {
      alert("Digite o nome do ponto.");
      return;
    }

    try {
      setCarregando(true);

      const payload = {
        nome,
        latitude: latLngSelecionado.lat,
        longitude: latLngSelecionado.lng,
      };

      const resp = await fetch(`${API}/mapas/${id}/pontos`, {
        method: "POST",
        headers: headersAuth,
        body: JSON.stringify(payload),
      });

      const dados = await resp.json();
      if (!resp.ok) {
        alert(dados?.erro || "Erro ao criar ponto.");
        return;
      }

      setPontos((prev) => [dados, ...prev]);
      fecharModal();
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function iniciarEdicao(p) {
    setEditandoId(p.id);
    setNomeEdicao(p.nome || "");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNomeEdicao("");
  }

  async function salvarEdicao(idPonto) {
    const nome = nomeEdicao.trim();
    if (!nome) {
      alert("O nome do ponto não pode ficar vazio.");
      return;
    }

    try {
      setCarregando(true);

      const resp = await fetch(`${API}/pontos/${idPonto}`, {
        method: "PUT",
        headers: headersAuth,
        body: JSON.stringify({ nome }),
      });

      const dados = await resp.json();
      if (!resp.ok) {
        alert(dados?.erro || "Erro ao editar ponto.");
        return;
      }

      setPontos((prev) => prev.map((p) => (p.id === idPonto ? { ...p, nome } : p)));
      cancelarEdicao();
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function deletarPonto(idPonto) {
    if (!confirm("Excluir este ponto?")) return;

    try {
      setCarregando(true);

      const resp = await fetch(`${API}/pontos/${idPonto}`, {
        method: "DELETE",
        headers: headersAuth,
      });

      const dados = await resp.json();
      if (!resp.ok) {
        alert(dados?.erro || "Erro ao excluir ponto.");
        return;
      }

      setPontos((prev) => prev.filter((p) => p.id !== idPonto));
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function deletarTodos() {
    if (!confirm("Excluir todos os pontos deste mapa?")) return;

    try {
      setCarregando(true);

      const resp = await fetch(`${API}/mapas/${id}/pontos`, {
        method: "DELETE",
        headers: headersAuth,
      });

      const dados = await resp.json();
      if (!resp.ok) {
        alert(dados?.erro || "Erro ao excluir todos os pontos.");
        return;
      }

      setPontos([]);
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  const centro = useMemo(() => {
    if (pontos.length > 0) return [pontos[0].latitude, pontos[0].longitude];
    return [-23.55052, -46.633308];
  }, [pontos]);

  return (
    <main className="detalhe">
      <section className="detalhe_container">
        <header className="detalhe_topo">
          <div className="detalhe_titleBox">
            <h1 className="detalhe_titulo">{mapa?.nome || "Detalhe do Mapa"}</h1>
            <p className="detalhe_sub">
              Total de pontos: <b>{pontos.length}</b>
            </p>
          </div>

          <div className="detalhe_botoes">
            <button
              className="detalhe_btnDanger"
              onClick={deletarTodos}
              disabled={carregando || pontos.length === 0}
            >
              Excluir todos
            </button>
            <button className="detalhe_btn" onClick={() => navegar("/meus-mapas")}>
              Voltar
            </button>
          </div>
        </header>

        <div className="detalhe_grid">
          <div className="detalhe_mapa">
            <MapContainer center={centro} zoom={12} className="leaflet_box">
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <ClickNoMapa onClick={abrirModalNovoPonto} />

              {pontos.map((p) => (
                <Marker key={p.id} position={[p.latitude, p.longitude]}>
                  <Popup>
                    <b>{p.nome}</b>
                    <br />
                    Latitude: {Number(p.latitude).toFixed(6)}
                    <br />
                    Longitude: {Number(p.longitude).toFixed(6)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <p className="detalhe_instrucaoMapa">
              <strong>Clique no mapa para adicionar um ponto.</strong>
            </p>
          </div>

          <aside className="detalhe_lista">
            <h2 className="detalhe_listaTitulo">Pontos cadastrados</h2>

            {carregando && pontos.length === 0 && <p>Carregando...</p>}
            {!carregando && pontos.length === 0 && <p>Nenhum ponto cadastrado ainda.</p>}

            <ul className="detalhe_ul">
              {pontos.map((p) => (
                <li className="detalhe_item" key={p.id}>
                  <div className="detalhe_itemInfo">
                    {editandoId === p.id ? (
                      <>
                        <input
                          className="detalhe_input"
                          value={nomeEdicao}
                          onChange={(e) => setNomeEdicao(e.target.value)}
                        />

                        <div className="detalhe_itemBtns">
                          <button
                            className="detalhe_btnPeq"
                            onClick={() => salvarEdicao(p.id)}
                            disabled={carregando}
                          >
                            Salvar
                          </button>

                          <button
                            className="detalhe_btnPeqSecundario"
                            onClick={cancelarEdicao}
                            disabled={carregando}
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <b className="detalhe_nome">{p.nome}</b>

                        <div className="detalhe_coord">
                          <div>Latitude: {Number(p.latitude).toFixed(5)}</div>
                          <div>Longitude: {Number(p.longitude).toFixed(5)}</div>
                        </div>

                        <div className="detalhe_itemBtns">
                          <button
                            className="detalhe_btnPeq"
                            onClick={() => iniciarEdicao(p)}
                            disabled={carregando}
                          >
                            Editar
                          </button>

                          <button
                            className="detalhe_btnPeqExcluir"
                            onClick={() => deletarPonto(p.id)}
                            disabled={carregando}
                          >
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {modalAberto && (
        <div className="modal_overlay" onClick={fecharModal}>
          <div className="modal_box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal_titulo">Criar ponto</h3>

            <form onSubmit={confirmarNovoPonto} className="modal_form">
              <label className="modal_label">Nome do ponto</label>
              <input
                className="modal_input"
                value={nomePonto}
                onChange={(e) => setNomePonto(e.target.value)}
                placeholder="Ex: Shopping, Casa, Trabalho..."
              />

              <div className="modal_coords">
                <div>
                  <label className="modal_label">Latitude</label>
                  <input className="modal_input" value={latLngSelecionado?.lat ?? ""} readOnly />
                </div>
                <div>
                  <label className="modal_label">Longitude</label>
                  <input className="modal_input" value={latLngSelecionado?.lng ?? ""} readOnly />
                </div>
              </div>

              <div className="modal_botoes">
                <button className="modal_btn" type="submit" disabled={carregando}>
                  {carregando ? "Salvando..." : "Confirmar"}
                </button>
                <button className="modal_btnSecundario" type="button" onClick={fecharModal} disabled={carregando}>
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
