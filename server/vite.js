import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message, source = "express") {
  console.log(`[${source}] ${message}`);
}

export async function setupVite(app, server) {
  const dirname = path.dirname(__dirname);
  const logVite = (message) => log(message, "vite");
  const viteServer = await createViteServer({
    configFile: path.join(dirname, "vite.config.js"),
    server: {
      middlewareMode: true,
      hmr: {
        server,
        host: true,
        port: 443,
        clientPort: 443
      },
      cors: true,
      host: true,
      // Allow the specific Replit domain
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '4b48ff50-cdc9-4f4c-a968-95137ffb0995-00-2zgkdbawsebq5.picard.replit.dev',
        '*.replit.dev',
        '*.replit.app',
        '*.repl.co'
      ]
    },
    appType: "spa",
    logLevel: "info",
    customLogger: {
      info: logVite,
      warn: logVite,
      error: logVite,
    },
  });

  // use vite's connect instance as middleware
  app.use(viteServer.middlewares);

  // Fallback handler (SPA) to display React application
  app.use("*", async (req, res, next) => {
    try {
      // 1. Read index.html
      let clientRoot = path.join(dirname, "client");
      let template = fs.readFileSync(
        path.resolve(clientRoot, "index.html"),
        "utf-8"
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins
      template = await viteServer.transformIndexHtml(req.originalUrl, template);

      // 3. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      // If an error is caught, let Vite fix the stacktrace for better debugging
      viteServer.ssrFixStacktrace(e);
      next(e);
    }
  });
}

export function serveStatic(app) {
  const dirname = path.dirname(__dirname);
  const publicDir = path.join(dirname, "dist", "public");
  log(`serving static files from ${publicDir}`);

  app.use(express.static(publicDir));

  app.use("*", (req, res) => {
    // Fallback
    const indexPath = path.join(publicDir, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not found");
    }
  });
}