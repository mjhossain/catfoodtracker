// This is a simple wrapper file to maintain compatibility with the package.json script
// We now use the direct Supabase client from the frontend, no backend storage needed
import express from "express";
import http from "http";
import { fileURLToPath } from 'url';
import path from "path";
import { createServer as createViteServer } from "vite";

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirname = path.dirname(__dirname);

// Add simple status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    message: 'Cat feeding tracker API is running. Using Supabase for data storage.'
  });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

async function main() {
  const server = http.createServer(app);
  
  console.log("[express] setting up server...");
  
  // Create Vite server in middleware mode (no Replit-specific HMR)
  const vite = await createViteServer({
    configFile: path.join(dirname, "vite.config.js"),
    server: { 
      middlewareMode: true, 
      hmr: true, // Use default HMR settings
      cors: true,
      host: true
    },
    appType: "spa",
    clearScreen: false
  });
  
  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // Serve static files from client
  app.use(express.static(path.join(dirname, "client")));
  
  // Add CORS headers - make sure this comes before any routes
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });
  
  // Error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });
  
  // Fallback handler (SPA) - must be after API routes
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // Read the index.html file
      let templatePath = path.resolve(dirname, "client", "index.html");
      let template = await vite.transformIndexHtml(url, await import('fs').then(fs => fs.readFileSync(templatePath, 'utf-8')));
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
  
  // Start server
  const port = Number(process.env.PORT) || 5055;
  
  server.listen(port, "0.0.0.0", () => {
    console.log(`[express] serving on port ${port}`);
  });
}

main().catch(console.error);