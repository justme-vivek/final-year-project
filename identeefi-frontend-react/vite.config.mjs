import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Expose any REACT_APP_* vars (CRA convention) as process.env.* for libs/tests.
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  const define = { 'process.env': '{}' };
  for (const [key, value] of Object.entries(env)) {
    define[`process.env.${key}`] = JSON.stringify(value);
  }
  define['process.env.NODE_ENV'] = JSON.stringify(
    mode === 'production' ? 'production' : 'development'
  );

  return {
    plugins: [react()],
    server: { port: 3000, open: false },
    preview: { port: 4173 },
    build: {
      outDir: 'build',
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
            if (
              id.includes('wagmi') || id.includes('viem') || id.includes('ethers') ||
              id.includes('@web3modal') || id.includes('@reown') || id.includes('@walletconnect') ||
              id.includes('@tanstack')
            ) return 'web3';
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'motion';
            if (
              id.includes('react-router') || id.includes('@react-router') ||
              id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')
            ) return 'vendor';
            return undefined;
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@mui/material', 'ethers', 'wagmi', 'viem'],
    },
    define,
  };
});
