import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Mock database for admins (in real app, fetch from Firestore)
let adminEmails: string[] = ["shazaincheemaac30@gmail.com"]; // Default admin from runtime context

// API Routes
app.post("/api/notify-admins", async (req, res) => {
  const { type, details } = req.body;
  
  console.log(`[Notification Mock] Type: ${type}. Formspree is now the primary notification method.`);
  console.log(`[Notification Details]`, details);
  
  return res.json({ success: true, message: "Notification handled by Formspree (Mocked on server)" });
});

// Route to update admin emails (called from Settings.tsx)
app.post("/api/update-admin-emails", (req, res) => {
  const { emails } = req.body;
  if (Array.isArray(emails)) {
    adminEmails = emails;
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid emails format" });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
