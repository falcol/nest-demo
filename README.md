# Nestjs auth + Websocket(socket.io) + Redis Demo
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Typeorm book
[typeorm book](https://orkhan.gitbook.io/typeorm/docs/active-record-data-mapper)


## Websocket test
```
1. Auth in api
2. Get access token change in index.html
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### link open: http://localhost:3000/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Format

```bash
npm run format
```

## Scaffolding

```bash
nest g res folder_name
```

## Migrate typeorm
```bash
npm run migration:generate --name=init1
npm run build
npm run migration:run
-> If not migrate -> npm run build
```

## Migrate prisma  [prisma ex 1](https://notiz.dev/blog/how-to-connect-nestjs-with-prisma)  [prisma ex2](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)
[prisma migrate ex](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model)
```bash
npx prisma db push
```
```bash
.\merge-schemas.sh
npx prisma migrate dev --name "init"
```

## Debug Launch.json vscode
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "NestJS Debug",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run-script",
                "start:debug"
            ],
            "timeout": 10000,
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "restart": true,
            "skipFiles": [
                "<node_internals>/**"
            ]
        }
    ]
}
```
