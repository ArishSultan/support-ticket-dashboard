import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:4000/api/docs-json',
    },
    output: {
      mode: 'split',
      target: './libs/api-client/src/generated/api.ts',
      schemas: './libs/api-client/src/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './libs/api-client/src/mutator.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
