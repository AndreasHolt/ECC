const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                elgamal: resolve(__dirname, 'elgamal.html'),
                finitefield: resolve(__dirname, 'finitefield.html'),
            },
        },
        target: ['es2020'],
    },
});
