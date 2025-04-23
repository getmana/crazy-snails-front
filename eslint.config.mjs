import pluginImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ['next', 'prettier'],
        plugins: ['prettier'],
    }),
    {
        plugins: {
            import: pluginImport,
            'simple-import-sort': simpleImportSort,
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [['^\\w', '^@\\w'], [], ['^@\\/'], [], ['^\\./', '^\\.\\./']],
                },
            ],
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
        },
    },
];

export default eslintConfig;
