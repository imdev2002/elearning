** require
- Docker, docker-compose
- yarn
- npx
- node version 18

** Running
- Run database docker-compose (Redis, Postgres, PostgreAdmin) first
 copy `db.yml` to another directory and change it to `docker-compose.yml`
 run databases with the file `docker-compose up -d`
 
- Run docker and yarn install for this repo
```!/bin/bash
yarn
npx prisma migrate dev --name init
yarn up local
```

**Note

-The migrateData.ts file will be deleted after deploying to production