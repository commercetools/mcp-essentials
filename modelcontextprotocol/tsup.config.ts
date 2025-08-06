import {defineConfig} from 'tsup';

export default defineConfig((options) => {
  const isDev = options.env?.NODE_ENV === 'dev';
  return {
    entry: ['src'],
    outDir: 'dist',
    sourcemap: true,
    watch: isDev,
    format: ['cjs'],
    dts: true,
    ignoreWatch: 'src/test',
  };
});
