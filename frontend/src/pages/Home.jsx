import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gifHome from "../assets/maps.gif";
import jpgHome from "../assets/buildings-trees.jpg";
import "./css/Home.css";

export default function Home() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  function irPara(caminho) {
    setAberto(false);
    navigate(caminho);
  }

  function abrir() {
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
  }

  return (
    <main className="home" style={{ backgroundImage: `url(${jpgHome})` }}>
      <section className="home_conteudo">
        <div className="home_esquerda">
          <div className="home_circulo">
            <img className="home_gif" src={gifHome} alt="Meus Mapas" />
          </div>
        </div>

        <div className="home_direita">
          <h1 className="home_titulo">MEUS MAPAS</h1>

          <p className="home_texto">
            Guarde seus lugares favoritos e reencontre cada detalhe quando quiser.
          </p>

          <button className="home_botao" onClick={abrir}>
            Já possui conta?
          </button>
        </div>
      </section>

      <footer className="home_footer">
        Copyright © 2025 All Rights Reserved
      </footer>

      {aberto && (
        <div className="home_overlay" onClick={fechar}>
          <div className="home_pop_up" onClick={(e) => e.stopPropagation()}>
            <h3 className="home_pop_upTitulo">
              Deseja criar uma conta ou fazer login?
            </h3>

            <div className="home_acoes">
              <button className="home_opcao" onClick={() => irPara("/cadastro")}>
                Criar conta
              </button>
              <button className="home_opcao" onClick={() => irPara("/login")}>
                Fazer login
              </button>
            </div>

            <button className="home_fechar" onClick={fechar}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
