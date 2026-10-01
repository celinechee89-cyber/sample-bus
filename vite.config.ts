import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const apiMiddlewarePlugin = (): Plugin => ({
  name: 'api-serverless-routes',
  configureServer(server) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const url = req.url || '';
      if (url.startsWith('/api/heath') || url.startsWith('/api/health')) {
        res.setHeader('Content-Type', 'application/json');
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        const { default: handler } = await import('./api/heath.js');
        return handler(req, res);
      }

      if (url.startsWith('/api/bus-arrival')) {
        const parsed = new URL(url, 'http://localhost:3000');
        req.query = Object.fromEntries(parsed.searchParams.entries());
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        const { default: handler } = await import('./api/bus-arrival.js');
        return handler(req, res);
      }

      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
