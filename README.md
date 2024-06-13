# Restaraunt Queue Management API (API de Gerenciamento de Fila de Restaurante)

## TO-DO

## [Documentação da API](https://documenter.getpostman.com/view/21997570/2sA3XPE3SY)


## Como Usar

1. Criar um arquivo `.env.development.local` na raiz do projeto

![Print](/docs/how-to-use/create-env-file.png)

2. Preencher o arquivo `.env.development.local` com as seguintes variáveis de ambiente:
```
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

JWT_SECRET=
JWT_EXPIRES_IN=
``` 
- As variáveis com o pré-fixo `DB` se referem ao banco de dados e são essenciais para a conexão do `back-end` com o `database` (Para esse projeto, foi usado o `MySQL`)
- As variáveis com o pré-fixo `JWT` se referem a criptografia dos tokens de autenticação, a ausência delas impedirá o uso das rotas que exijam autenticação.

3. Abrir o projeto no terminal e digitar o seguinte comando: `npm run start:dev`
