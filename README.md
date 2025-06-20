DSM-P3-G06-2025-1 <br>
GRUPO DO PROJETO INTERDISCIPLINAR FATEC FRANCA <br>

PARTICIPANTES:

GABRIEL ANDRADE ALEIXO <br>
GABRIEL CAMARA DE OLIVEIRA <br>
URIEL MONTE PAZ DE ARAÚJO <br>
HUDSON RIBEIRO BARBARA JÚNIOR <br>

# Requerimentos para executar o projeto

Node tem que estár instalado

Caso queira rodar localmente instale o MongoDB
https://faustocintra.com.br/desenvolvimento-back-end/configurando-o-mongodb-server-local-para-uso-com-prisma-orm/

# Como executar o projeto

### Clone o repositoria em uma pasta
```bash
git clone https://github.com/FatecFranca/DSM-P3-G06-2025-1.git
```

### Agora no terminal digite o comando
```bash
cd .\DSM-P3-G06-2025-1\back-end\
```

Dentro da pasta back-end (Onde estamos agora) crie um arquivo chamado ".env" e coloque esses código de conexão nele
```env
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mongodb+srv://StudyPlus:senha123@studyplus.rbcn1rr.mongodb.net/StudyPlus?retryWrites=true&w=majority&appName=StudyPlus"
```

depois digite os seguintes códigos
```bash
npm i
```
```bash
npx prisma generate
```

agora podemos executar o back-end do projeto usando
```bash
npm run dev
```

### Abra otro terminal para executarmos o front e dê o comando
```bash
cd .\DSM-P3-G06-2025-1\front-end\
```

Dentro da pasta front-end (Onde estamos agora) crie um arquivo chamado ".env" e coloque esses código de conexão nele
```env
NEXT_PUBLIC_API_URL="http://localhost:8080"
```

agora nele execute
```bash
npm i
```

depois
```bash
npm run dev
```

### Agora basta apenas ir no seu navegador e pesquisar por http://localhost:3000/

# Veja um vídeo explicativo

https://github.com/user-attachments/assets/bbe6d8d1-d3b6-4d8e-a1bf-ba0de98824c5


