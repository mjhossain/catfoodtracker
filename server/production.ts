
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { fileURLToPath } from 'url';
import path from "path";

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirname = path.dirname(__dirname);

// Add simple status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    message: 'Cat feeding tracker API is running. Using Supabase for data storage.'
  });
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
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

// Add CORS headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(dirname, "dist/public")));

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any).status || (err as any).statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Fallback handler (SPA)
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(dirname, "dist/public/index.html"));
});

// Start server
const port = process.env.PORT || 5055;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`[express] serving on port ${port}`);
}); 