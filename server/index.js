import express from "express";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple API endpoint for status check
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Create HTTP server
  const server = require('http').createServer(app);

  // Error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // Setup Vite development server or static file serving
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start the server
  // Use port 5000 for Replit compatibility but express will internally use 5055
  const runtimePort = 5055; // The port our app will use internally
  const replitPort = 5055; // The port Replit expects
  
  server.listen({
    port: replitPort,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${replitPort} (internally using ${runtimePort})`);
  });
})();