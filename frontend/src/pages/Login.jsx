import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [carregando, setCarregando] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function enviar(e) {
    e.preventDefault();

    const email = form.email.trim();
    const senha = form.senha;

    if (!email || !senha) {
      alert("Informe o e-mail e a senha");
      return;
    }

    try {
      setCarregando(true);

      const resp = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(dados?.erro || "Não foi possível fazer login.");
        return;
      }

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));

      navigate("/meus-mapas");
    } catch {
      alert("Erro ao conectar no servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login">
      <section className="login_conteudo">
        <h1 className="login_titulo">Entrar</h1>
        <p className="login_texto">Acesse sua conta para ver seus mapas.</p>

        <form className="login_form" onSubmit={enviar}>
          <label className="login_label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            className="login_input"
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            placeholder="e-mail@gmail.com"
            required
          />

          <label className="login_label" htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            className="login_input"
            name="senha"
            value={form.senha}
            onChange={onChange}
            type="password"
            placeholder="Senha"
            required
          />

          <button className="login_botao" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <button
            className="login_link"
            type="button"
            onClick={() => navigate("/cadastro")}
          >
            Não tenho conta
          </button>
        </form>
      </section>
    </main>
  );
}
