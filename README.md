## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Typeorm book
[typeorm book](https://orkhan.gitbook.io/typeorm/docs/active-record-data-mapper)

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

## Migrate
```bash
npm run migration:generate --name=init1
npm run build
npm run migration:run
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
