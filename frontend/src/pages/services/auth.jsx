const CHAVE_TOKEN = "token";

export function salvarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function pegarToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}

export function estaLogado() {
  return !!pegarToken();
}
