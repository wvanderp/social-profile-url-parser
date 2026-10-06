import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import compat from 'eslint-plugin-compat';
import { importX } from 'eslint-plugin-import-x';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import airbnbRules from './eslint.airbnb-rules.mjs';

export default [
    {
        ignores: ['node_modules/**', 'lib/**', 'coverage/**', 'test/cases/**/*.json'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.lint.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.browser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            '@stylistic': stylistic,
            compat,
            import: importX,
            sonarjs,
            unicorn,
        },
        settings: {
            'import-x/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
            'import-x/resolver': {
                typescript: { alwaysTryTypes: true },
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    moduleDirectory: ['node_modules', 'src/'],
                },
            },
            polyfills: [],
        },
        rules: {
            ...js.configs.recommended.rules,
            ...airbnbRules,
            ...tsPlugin.configs['eslint-recommended'].overrides[0].rules,
            ...tsPlugin.configs.recommended.rules,
            ...compat.configs.recommended.rules,
            ...sonarjs.configs.recommended.rules,
            ...unicorn.configs.recommended.rules,
            '@stylistic/function-call-spacing': ['error', 'never'],
            '@typescript-eslint/only-throw-error': 'error',
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
            '@stylistic/linebreak-style': 'off',
            'unicorn/prefer-node-protocol': 'off',
            'unicorn/prefer-module': 'off',
            'unicorn/no-array-reduce': 'off',
            // Keep the existing style and browser API choices during the migration.
            'unicorn/no-array-sort': 'off',
            'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
            'unicorn/no-computed-property-existence-check': 'off',
            'unicorn/no-top-level-side-effects': 'off',
            'unicorn/prefer-await': 'off',
            'unicorn/prefer-short-escape-sequences': 'off',
            'unicorn/prefer-ternary': 'off',
            'sonarjs/no-invariant-returns': 'off',
            'no-restricted-syntax': 'off',
            'no-continue': 'off',
            'unicorn/filename-case': ['error', {
                cases: { pascalCase: true, camelCase: true },
            }],
        },
    },
    {
        files: ['scripts/**/*.ts', 'createTest.ts', '*.config.ts'],
        languageOptions: { globals: globals.node },
    },
    {
        files: ['test/**/*.ts'],
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            'func-names': 'off',
            'prefer-arrow-callback': 'off',
            'sonarjs/no-duplicate-string': 'off',
        },
    },
];
