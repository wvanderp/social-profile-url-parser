// eslint-disable-next-line import/no-extraneous-dependencies
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            exclude: [...coverageConfigDefaults.exclude, 'scripts/collect.ts'],
        },
    },
});
