import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function enviar(e) {
    e.preventDefault();

    const nome = form.nome.trim();
    const email = form.email.trim();

    if (!nome || !email || !form.senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha: form.senha }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(data?.erro || "Erro ao cadastrar.");
        return;
      }

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch {
      alert("Sem conexão com o backend!");
    }
  }

  return (
    <main className="cadastro">
      <section className="cadastro_conteudo">
        <h1 className="cadastro_titulo">Criar conta</h1>
        <p className="cadastro_texto">
          Crie sua conta para salvar seus lugares favoritos.
        </p>

        <form className="cadastro_form" onSubmit={enviar}>
          <label className="cadastro_label">
            Nome
            <input
              className="cadastro_input"
              name="nome"
              value={form.nome}
              onChange={onChange}
              type="text"
              placeholder="Nome"
              required
            />
          </label>

          <label className="cadastro_label">
            E-mail
            <input
              className="cadastro_input"
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              placeholder="e-mail@gmail.com"
              required
            />
          </label>

          <label className="cadastro_label">
            Senha
            <input
              className="cadastro_input"
              name="senha"
              value={form.senha}
              onChange={onChange}
              type="password"
              placeholder="Senha"
              required
            />
          </label>

          <button className="cadastro_botao" type="submit">
            Cadastrar
          </button>

          <button
            className="cadastro_link"
            type="button"
            onClick={() => navigate("/login")}
          >
            Já tenho conta
          </button>
        </form>
      </section>
    </main>
  );
}
