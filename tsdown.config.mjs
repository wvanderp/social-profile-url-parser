import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: {
        index: 'src/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'lib',
    platform: 'neutral',
    target: 'es2019',
});
