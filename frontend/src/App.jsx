import { Routes, Route } from "react-router-dom";
import Menu from "./pages/layout/Menu";

import Home from "./pages/Home";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import MeusMapas from "./pages/MeusMapas";
import MapaDetalhe from "./pages/MapaDetalhe";

export default function App() {
  return (
    <div className="app">
      <Menu />
      <div className="app_conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/meus-mapas" element={<MeusMapas />} />
          <Route path="/mapa/:id" element={<MapaDetalhe />} />
        </Routes>
      </div>
    </div>
  );
}
