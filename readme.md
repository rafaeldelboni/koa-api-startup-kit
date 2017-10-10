# Efir API

Efir backend api

## Instructions

Create an `.env` file based on the `.env.example`
```bash
  cp .env.example .env
```
Check and replace the environment variables in the new file.

## Development database

`docker run -it -p 5432:5432 -e POSTGRES_USER='root' -e POSTGRES_PASSWORD='password' -e POSTGRES_DB='db_efir' postgres:10`
