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

agora nele execute
```bash
npm i
```

depois
```bash
npm run dev
```

### Agora basta apenas ir no seu navegador e pesquisar por http://localhost:3000/
