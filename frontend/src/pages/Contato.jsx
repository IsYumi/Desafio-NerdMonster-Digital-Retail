import { useState } from "react";
import "./css/Contato.css";
import traveler from "../assets/traveler.png";
const inicial = { nome: "", email: "", mensagem: "" };

export default function Contato() {
  const [form, setForm] = useState(inicial);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function enviar(e) {
    e.preventDefault();
    alert("Mensagem enviada!");
    setForm(inicial);
  }

  return (
    <main className="contato">
      <section className="contato_container">
        <div className="contato_esquerda">
          <h1 className="contato_titulo">Contato</h1>

          <div className="contato_card">
            <form className="contato_form" onSubmit={enviar}>
              <div className="contato_campo">
                <label className="contato_label" htmlFor="nome">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  className="contato_input"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome"
                />
              </div>

              <div className="contato_campo">
                <label className="contato_label" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="contato_input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                />
              </div>

              <div className="contato_campo">
                <label className="contato_label" htmlFor="mensagem">
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  className="contato_textarea"
                  value={form.mensagem}
                  onChange={handleChange}
                />
              </div>

              <div className="contato_acoes">
                <button className="contato_btn" type="submit">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="contato_direita">
          <img className="contato_img" src={traveler} />
        </div>
      </section>
    </main>
  );
}
