import { libx } from 'libx.js/build/bundles/node.essentials';
import { log, LogLevel } from 'libx.js/build/modules/log';
import Program from 'libx.js/build/node/Program';
import { IScript } from 'libx.js/src/helpers/IScript';
import { PostmanManager } from './PostmanManager';
import { SwaggerManager } from './SwaggerManager';
import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';

log.filterLevel = LogLevel.Error;

const conf = {
    postmanApiKey: '<Postman API Key>',
    collectionId: '<Collection ID>',
    swaggerOptions: {}, // ref: https://joolfe.github.io/postman-to-openapi/#options
    defaultInput: '.tmp/postman_collection.json',
    defaultOutput: '.tmp/swagger.yml',
    envs: {
        prod: {
            baseUrl: 'prd',
            collectionId: '<Collection ID>',
        },
        staging: {
            baseUrl: 'stg',
            collectionId: '<Collection ID>',
        },
    },
};

// node build/Main.js --env="prod" --postmanApiKey="<key>" --collectionId="<colId>"
// node build/Main.js --env="staging" --postmanApiKey="<key>" --collectionId="<colId>" -q
// node build/Main.js --postmanApiKey="<key>" --collectionId="<colId>" --skipDL
// node build/Main.js --postmanApiKey="<key>" --collectionId="<colId>" --output="./output.yml"
export class Script implements IScript<typeof conf> {
    public async executeAsScript(config: typeof conf, env: string = Program.args.env, envConf: typeof conf.envs.prod): Promise<void> {
        if (Program.args.h || Program.args.help) return this.printHelp();

        const quite = Program.args.q || false;
        const apiKey = Program.args.postmanApiKey || config.postmanApiKey;
        const collectionId = Program.args.collectionId || config.collectionId;
        let input = Program.args.input;
        const output = Program.args.output || config.defaultOutput;
        const skipDownload = Program.args.skipDL || false;

        if (!quite) log.filterLevel = LogLevel.Verbose;

        log.verbose('Script: Begin execute: ', 'env:', env);
        libx.node.mkdirRecursiveSync(output);

        if (!skipDownload && input == null) {
            log.verbose('Script: download collection', collectionId);
            const pMgr = new PostmanManager(apiKey);
            const collection = await pMgr.getCollection(collectionId);
            input = config.defaultInput;
            fs.writeFileSync(config.defaultInput, collection);
            log.info('Script: download completed and written to:', input);
        } else {
            log.info('Script: skipping download');
        }

        const sMgr = new SwaggerManager(config.swaggerOptions);
        log.verbose('Script: begin conversion to swagger');
        const swagger = await sMgr.convertPostmanToSwagger(input, output, conf.swaggerOptions);
        log.info('Script: ' + log.color('conversion completed, output:', log.colors.fgGreen), output);

        log.info('DONE!');
        return;
    }

    private printHelp() {
        console.log(`
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
`);
        exit(0);
    }
}

if (libx.node.isCalledDirectly()) Program.run(new Script(), conf, Program.args.env || 'prod');
