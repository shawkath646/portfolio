import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import importPlugin from 'eslint-plugin-import'

const lintConfig = [
    ...nextVitals,
    ...nextTs,

    {
        ignores: [
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            'node_modules/**',
            'server.js',
        ],
    },

    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-unused-vars': 'off',

            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling'],
                        'index',
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        { pattern: 'react', group: 'external', position: 'before' },
                        { pattern: 'react-**', group: 'external', position: 'before' },
                        { pattern: 'next', group: 'external', position: 'before' },
                        { pattern: 'next/**', group: 'external', position: 'before' },
                        { pattern: '@/**', group: 'internal', position: 'after' },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'never',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    warnOnUnassignedImports: false,
                },
            ],

            'import/first': 'error',
            'import/newline-after-import': 'warn',
            'import/no-duplicates': 'error',
        },
    },
];

export default lintConfig;
