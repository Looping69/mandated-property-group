import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Isolated backend tests
        environment: 'node',
    },
});
