## DSM-P3-G06-2025-1: Sistema de Estudo / Projecto Interdisciplinar FATEC Franca

**Grupo do Projeto**: DSM-P3-G06-2025-1

**Participantes:**

* Gabriel Andrade Aleixo
* Gabriel Câmara de Oliveira
* Uriel Monte Paz de Araújo
* Hudson Ribeiro Bárbara Júnior

---

## Sumário

1. [Descrição do Projeto](#descrição-do-projeto)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Pré-requisitos](#pré-requisitos)
4. [Instalação e Configuração](#instalação-e-configuração)

   * [Clone do Repositório](#clone-do-repositório)
   * [Configuração do Back-end](#configuração-do-back-end)
   * [Configuração do Front-end](#configuração-do-front-end)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Como Executar](#como-executar)

   * [Executando o Back-end](#executando-o-back-end)
   * [Executando o Front-end](#executando-o-front-end)
7. [Vídeo Demonstrativo](#vídeo-demonstrativo)
8. [Boas Práticas](#boas-práticas)
9. [Contribuição](#contribuição)
10. [Licença](#licença)

---

## Descrição do Projeto

Este projeto consiste em um sistema full-stack desenvolvido para atender aos requisitos do Projeto Interdisciplinar da FATEC Franca. A aplicação envolve um back-end em Node.js com Prisma ORM e um front-end em Next.js.

---

## Tecnologias Utilizadas

* **Back-end**:

  * Node.js
  * Express
  * Prisma ORM
  * MongoDB (Atlas ou local)
* **Front-end**:

  * Next.js (React)
  * Tailwind CSS (ou outro framework de estilo, conforme preferência)
* **Ferramentas de Desenvolvimento**:

  * Git/GitHub para versionamento
  * VSCode (ou editor de preferência)
  * RapidAPI (para testes de API)
* **Outros**:

  * npm

---

## Pré-requisitos

Antes de executar o projeto, verifique se você possui:

* **Node.js** instalado (versão recomendada: >= 16.x).
* **npm** (vem junto com o Node.js) ou Yarn.
* **MongoDB** se deseja rodar localmente. Caso prefira usar um cluster na nuvem (MongoDB Atlas), tenha a string de conexão.

> Caso não deseje instalar MongoDB localmente, você pode pular o passo de instalação e usar um cluster no Atlas.

---

## Instalação e Configuração

### Clone do Repositório

No terminal, execute:

```bash
git clone https://github.com/FatecFranca/DSM-P3-G06-2025-1.git\
```
Em seguida, navegue até a pasta do projeto:
```bash
cd DSM-P3-G06-2025-1
```

### Configuração do Back-end

1. Navegue até a pasta do back-end:

   ```bash
   cd back-end
   ```
2. Crie um arquivo `.env` na raiz da pasta `back-end` com as variáveis de ambiente necessárias.
3. Instale dependências:

   ```bash
   npm install
   ```
4. Gere o cliente do Prisma:

   ```bash
   npx prisma generate
   ```

> **Importante**: não versionar o arquivo `.env` no Git. Utilize o `.gitignore` para evitar expor credenciais.

### Configuração do Front-end

1. Em outra aba/terminal, navegue até a pasta do front-end:

   ```bash
   cd front-end
   ```
2. Crie um arquivo `.env.local` (ou `.env`) na raiz da pasta `front-end` com as variáveis de ambiente necessárias.
3. Instale dependências:

   ```bash
   npm install
   ```

---

## Variáveis de Ambiente

Abaixo exemplos de variáveis que devem constar nos arquivos `.env` para cada parte. **Substitua pelos seus valores reais**:

### Back-end (`back-end/.env`)

```env
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mongodb+srv://StudyPlus:senha123@studyplus.rbcn1rr.mongodb.net/StudyPlus?retryWrites=true&w=majority&appName=StudyPlus"
```

### Front-end (`front-end/.env.local` ou `.env`)

```env
NEXT_PUBLIC_API_URL="http://localhost:8080"
```

> Se for implantar em produção, ajuste essas variáveis para apontar para o domínio/URL corretos.

---

## Como Executar

### Executando o Back-end

1. Certifique-se de que as variáveis em `back-end/.env` estão corretas.
2. Inicie o servidor:

   ```bash
   npm run dev
   ```
3. O servidor estará disponível em `http://localhost:8080` (ou porta configurada).
4. Utilize Postman/Insomnia ou similar para testar rotas da API (endpoints REST ou GraphQL, conforme implementado).

### Executando o Front-end

1. Certifique-se de que `front-end/.env.local` aponta para a URL correta do back-end.
2. Inicie a aplicação:

   ```bash
   npm run dev
   ```
3. Acesse no navegador:

   ```
   http://localhost:3000
   ```

---

## Vídeo Demonstrativo

https://github.com/user-attachments/assets/bbe6d8d1-d3b6-4d8e-a1bf-ba0de98824c5


---

## Boas Práticas

* Mantenha o `.env` fora do controle de versão.
* Documente endpoints e fluxos importantes.
* Use linting e formatação consistente (ESLint, Prettier).
* Escreva testes automatizados (unitários/integrados) sempre que possível.
* Comentários claros e README atualizado.

---
