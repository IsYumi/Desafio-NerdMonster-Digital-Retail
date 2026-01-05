import { useNavigate } from "react-router-dom";
import pngMenu from "../../assets/location-mark.png";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const usuarioLogado = Boolean(localStorage.getItem("usuario"));

  function irPara(caminho) {
    navigate(caminho);
  }

  function sair() {
    localStorage.removeItem("usuario");
    navigate("/");
  }

  return (
    <header className="menu">
      <div className="menu_logo" onClick={() => irPara("/")}>
        <img className="menu_logoIcon" src={pngMenu} alt="Meus Mapas" />
        <span className="menu_logoTexto">Meus Mapas</span>
      </div>

      <nav className="menu_links">
        <button className="menu_link" onClick={() => irPara("/")}>
          Início
        </button>

        <button className="menu_link" onClick={() => irPara("/contato")}>
          Contato
        </button>

        {usuarioLogado && (
          <button className="menu_link" onClick={() => irPara("/meus-mapas")}>
            Mapas
          </button>
        )}
      </nav>

      <div className="menu_direita">
        {usuarioLogado && (
          <button className="menu_sair" onClick={sair}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
