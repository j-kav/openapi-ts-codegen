'use strict';

const OpenAPI = require('../dist');
const glob = require('glob');
const fs = require('fs');

describe('v3', () => {
    it('should generate', async () => {
        await OpenAPI.generate({
            input: './test/mock/v3/spec.json',
            output: './test/result/v3/',
            httpClient: OpenAPI.HttpClient.FETCH,
            useOptions: false,
            useUnionTypes: false,
            exportCore: true,
            exportSchemas: true,
            exportModels: true,
            exportServices: true,
        });

        const files = glob.sync('./test/result/v3/**/*.ts');

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8').toString();
            expect(content).toMatchSnapshot(file);
        });
    });
});
