import {defineConfig} from 'tsup';

export default defineConfig((options) => {
  const isDev = options.env?.NODE_ENV === 'dev';
  return [
    {
      entry: ['src/ai-sdk/index.ts'],
      outDir: 'ai-sdk',
      format: ['cjs', 'esm'],
      dts: true,
      sourcemap: true,
      watch: isDev,
    },
    {
      entry: ['src/modelcontextprotocol/index.ts'],
      outDir: 'modelcontextprotocol',
      format: ['cjs', 'esm'],
      dts: true,
      sourcemap: true,
      watch: isDev,
    },
    {
      entry: ['src/langchain/index.ts'],
      outDir: 'langchain',
      format: ['cjs', 'esm'],
      dts: true,
      sourcemap: true,
      watch: isDev,
    },
    {
      entry: ['src/mastra/index.ts'],
      outDir: 'mastra',
      format: ['cjs', 'esm'],
      dts: true,
      sourcemap: true,
      watch: isDev,
    },
  ];
});
