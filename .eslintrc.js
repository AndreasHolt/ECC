module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4],
        'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
        'max-classes-per-file': ['error', 3],
        'max-len': ['error', { code: 200 }],
    },
};
