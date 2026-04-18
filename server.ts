import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "urban_griot_online", timestamp: new Date().toISOString() });
  });

  app.get("/api/archive", (req, res) => {
    res.json([
      { id: "1", title: "GENESIS DROP", season: "SEASON 01", description: "The beginning. Raw concrete textures and pure kitenge patterns.", imageUrl: "https://picsum.photos/seed/archive1/800/800?grayscale" },
      { id: "2", title: "NIGHT MARKET", season: "SEASON 02", description: "Neon lights reflecting on wet tarmac. Heavy weight hoodies.", imageUrl: "https://picsum.photos/seed/archive2/800/800?grayscale" },
      { id: "3", title: "MONSOON", season: "SEASON 03", description: "Waterproof utility gear tested in the Dar monsoon season.", imageUrl: "https://picsum.photos/seed/archive3/800/800?grayscale" }
    ]);
  });

  app.get("/api/stories", (req, res) => {
    res.json([
      { id: "1", title: "THE SOUND OF MWENGE", excerpt: "Exploring the woodcarvers market and the rhythmic sound of chisels on ebony.", imageUrl: "https://picsum.photos/seed/story1/1200/600?grayscale", date: "OCT 12, 2024" },
      { id: "2", title: "CONCRETE & KITENGE", excerpt: "How local artisans are combining traditional fabric with modern street-wear silhouettes.", imageUrl: "https://picsum.photos/seed/story2/1200/600?grayscale", date: "NOV 05, 2024" }
    ]);
  });

  // Example API for fetching server configuration or health
  app.get("/api/info", (req, res) => {
    res.json({
      brand: "Urban Griot",
      location: "Dar Es Salaam / 6.7924° S, 39.2083° E",
      version: "1.0.0"
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Urban Griot backend serving at http://localhost:${PORT}`);
  });
}

startServer();
