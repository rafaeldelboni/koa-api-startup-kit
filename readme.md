Koa API Startup Kit
---------------------
My personal Koa2 API startup kit, feel free to use and contribute if you like.

# Prerequisites
- [Docker](https://www.docker.com)
- [Node.js 8.0+](http://nodejs.org)

# Setup Development Environment

## Create Config Files
Create an `.env` file based on the `.env.example`
```bash
  cp .env.example .env
```
Check and replace the environment variables in the new file.

## Initialize Database

Here you can either choose to have and instance of Postgres installed locally in your machine or use a docker container.

Simple example of using Postgres through Docker:
`docker run -it -p 5432:5432 -e POSTGRES_USER='root' -e POSTGRES_PASSWORD='password' -e POSTGRES_DB='db_efir' postgres:10`

_Keep in mind that sample above don't generate a volume, so it wont persist the data after you stop your docker container._

## Install dependencies

```bash
  yarn install
```

## Migrate database

```bash
  yarn migrate
```

## Starting App

```bash
  yarn dev
```

The server will be available in the port you set in the `.env` file

# Tests


```bash
# Unit
yarn test
# Integration
yarn test:i
# Acceptance
yarn test:a
# All (Sequential)
yarn test:all
```

_You need a database running with all migrations for the integration and acceptance tests_

## Todos

 - Email API (+Tests)
 - Password change & reset (via email)
 - Docker compose infrastructure
 - CI/CD Jenkinks
 - Production environment

License
----

MIT
