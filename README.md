<h1 align="center">
    <img src="https://raw.githubusercontent.com/Rocketseat/bootcamp-gostack-desafio-02/master/.github/logo.png" width="300px" >
</h1>

<h2 align="center">
    🚚 Fast Feet 📦
</h2>



# Clonar esté projeto

```
$ git clone https://github.com/nelsonplinio/fast-feet-backend
```

# ❗️ Requisitos

To runed this all project, you need have be the packages installed:
Para rodar todos os projetos, e necessario ter esses pacotes instalados.
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://legacy.yarnpkg.com/en/) (Optional).

# 💾 Backend

- API RESTFUL criado com o [express](https://expressjs.com/pt-br/) em nodeJS .

- Database utilizando [sequelize](https://sequelize.org/v5/).

## ⚡️ Start

- Para utilizar está api e necessario ter instalado o postgressSQL, estou utilizando docker [Docker](https://www.docker.com/).

- Se você não querer instalar o docker, pode instalar o [Postgres](https://www.postgresql.org/download/) em sua maquina.

### Rodar postgress com docker: 🐋

- No terminal, rode os seguintes comandos:

```
$ docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

#### Se estiver tudo pronto com o container do postgress, execute:

```
$ docker start "CONTAINER DOCKER ID"
```

- Para trabalhos em background e utilizado Redis no DOCKER.
- Se você não quiser instalar DOCKER, pode instalar na sua maquina o [Redis](https://chocolatey.org/packages/redis-64) e [Chocolatey](https://chocolatey.org/docs/installation)

### Rodar Redis com DOCKER: 🐋

```
$ docker run --name redis -d redis
```

#### Se estiver tudo pronto com o container do redis, execute:

```
$ docker start "CONTAINER DOCKER ID"
```

### Variaveis de ambiente:
- Crie uma copia do[.env.example](https://github.com/RennanD/fastfeet/blob/master/backend/.env.example) com o nome de .env na pasta root do projeto.


### Agora no seu terminal:

- Para iniciar o FastFeet database, vai para a pasta do projeto e rode os seguintes comandos:

```
$ cd fast-feet-backend

$ yarn

$ yarn sequelize db:create

$ yarn sequelize db:migrate

$ yarn sequelize db:seed:all

```
- Para iniciar o servidor, rode:

```
$ yarn dev
```

- Abra uma nova aba para rodar a fila de tarefas em background, rode:

```
$ yarn queue
```

#### Para debug, rode:

```
yarn dev:debug
```
