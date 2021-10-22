import postmanToOpenApi from 'postman-to-openapi';

export class SwaggerManager {
    constructor(private p2o_options?: any) {}

    public async convertPostmanToSwagger(input: string, out: string, options?: object) {
        try {
            const opts = { ...options, ...this.p2o_options };
            const result = await postmanToOpenApi(input, out, opts);
            // Without save the result in a file
            // const result2 = await postmanToOpenApi(input, null, opts);
            // console.log(`OpenAPI specs: ${result}`);
            return result;
        } catch (err) {
            console.log(err);
        }
    }
}
