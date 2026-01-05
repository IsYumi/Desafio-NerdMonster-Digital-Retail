# Desafio Meus Mapas
Sistema web desenvolvido como parte de um **teste técnico para a NerdMonster**, com o objetivo de permitir a criação de mapas lógicos e o cadastro de pontos físicos associados a esses mapas.

---

## Sobre o desafio
O **Meus Mapas** é um sistema simples de gerenciamento de mapas e pontos geográficos, composto por duas entidades principais:

- **Mapa**  
  Representa um mapa lógico criado pelo usuário.  
  Contém:
  - Nome do mapa
  - Data de criação
  - Lista de pontos associados

- **Ponto**  
  Representa um ponto físico dentro de um mapa.  
  Contém:
  - Nome do ponto
  - Latitude
  - Longitude

  Cada ponto pertence obrigatoriamente a um único mapa.
  
---
## Protótipo (Figma)

Protótipo visual do sistema:  
https://www.figma.com/design/dSuQFpWuaju8snnV8nM3Ev/Sem-t%C3%ADtulo?node-id=0-1&t=17hbXHoZ47CwDE9O-1

## Tecnologias Utilizadas

### Backend
- JavaScript
- Node.js
- API REST
- Express
- CORS

### Frontend
- React
- JavaScript (ES6+)
- Vite
- Axios
- CSS3
- HTML5

### Infraestrutura
- Docker
- Docker Compose

---

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Docker
- Docker Compose
- Git
- Node.js

---

## Como Utilizar a Aplicação

### Usuário de Demonstração
Usuário de demonstração já está disponível:
- **E-mail:** teste@teste.com  
- **Senha:** 1234

Essas credenciais permitem acessar todas as funcionalidades principais do sistema, incluindo:
- Criação de mapas
- Cadastro de pontos
- Edição e exclusão de dados

---

### Opção 1: Docker Compose (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/IsYumi/Desafio-NerdMonster-Digital-Retail.git

# Entrar no diretório do projeto
cd seu-repositorio

# Subir todos os serviços
docker-compose up --build
```

----

## URLs Disponíveis

| Serviço            | URL                            | Descrição                         |
|--------------------|--------------------------------|-----------------------------------|
| Backend (API)      | http://localhost:5000          | API principal                     |
| Frontend React     | http://localhost:3000          | Interface Web                     |
| Health Check       | http://localhost:5000/health   | Verifica status da API            |

---

### Opção 2: Execução Manual

### Backend
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm run dev

---

## Estrutura do Projeto

Meus_Mapas/  
├── backend/  
│   ├── node_modules/  
│   ├── src/  
│   │   ├── assets/  
│   │   ├── controllers/  
│   │   ├── db/  
│   │   ├── middleware/  
│   │   ├── routes/  
│   │   ├── utils/  
│   │   ├── app.js  
│   │   └── server.js  
│   ├── .env  
│   ├── .dockerignore  
│   ├── database.db  
│   ├── Dockerfile  
│   └── package.json  
│  
├── frontend/  
│   ├── node_modules/  
│   ├── public/  
│   ├── src/  
│   │   ├── assets/  
│   │   ├── pages/  
│   │   ├── App.jsx  
│   │   ├── main.jsx  
│   │   └── index.css  
│   ├── .dockerignore  
│   ├── Dockerfile  
│   ├── eslint.config.js  
│   ├── package.json  
│   └── vite.config.js  
│  
├── docker-compose.yml  
└── README.md  

---

### Licença
Este projeto é destinado a fins educacionais e avaliação técnica.
