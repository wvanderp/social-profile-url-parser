// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        removeEmpty: 'src/removeEmpty.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'lib',
    platform: 'neutral',
    target: 'es2019',
});
