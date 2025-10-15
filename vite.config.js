import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
    root: '.',
    publicDir: 'public',
    plugins: [tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@styles': path.resolve(__dirname, 'resources/css'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        open: true,
    },
});
