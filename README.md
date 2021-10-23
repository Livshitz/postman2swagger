# postman-to-swagger

CLI tool to convert Postman collection to swagger (OpenAPI) by providing Postman API key, collection Id and output swagger into file or std-out.

## Features:

1. ⭐️ Handles fetching of remote (cloud stored) Postman collection, format correction and conversion to Swagger file
1. Supports specifying local file or skipping download (reusing downloaded collection)
1. Wraps `postman-to-openapi` to simplify conversion process and cleanup collection json to avoid redundant errors

## Use:

Run without installing:

```sh
$ npx postman-to-swagger --postmanApiKey="<key>" --collectionId="<colId>" --output="./output.yml" -q
```

Install globally:

```sh
$ npm install -g postman-to-swagger
$ postman-to-swagger --postmanApiKey="<key>" --collectionId="<colId>" --output="./output.yml" -q
```

### Options:

```
Usage:
    $ postman-to-swagger <input>

    Options:
    -q                  Quite mode, outputs only swagger result
    --postmanApiKey     Postman API key to retrieve the collection
    --collectionId      Postman collection ID
    --input             Specify path to local Postman collection json, will skip downloading via API
    --output            Specify path for the output swagger yaml

    Example:
    $ postman-to-swagger --postmanApiKey="<key>" --collectionId="<colId>" --output="./output.yml" -q
```

## Develop:

### Build:

> `$ yarn build`

### Watch & Build:

> `$ yarn watch`

### Run tests:

> `$ yarn test`

### Debug:

> ` Select 'typescript' debug configuration, open file in vscode (to run it specifically) and run debugger`

or:

> ` Select 'Node Attach' debug configuration, run specific file in debug mode (you can pass also args):`

> `$ node --inspect build/Main.js`

---

Scaffolded with [🏗 TS-scaffold](https://github.com/Livshitz/ts-scaffold.git)
