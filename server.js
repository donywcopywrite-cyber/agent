import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ===== config =====
const app = express();
app.use(cors({ origin: "*" })); // tighten later to your Bubble/GHL domain
app.use(express.json({ limit: "2mb" }));

// Optional bearer auth for your API
app.use((req, res, next) => {
  const needed = process.env.AUTH_BEARER;
  if (!needed) return next();
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (token !== needed) return res.status(401).json({ error: "Unauthorized" });
  next();
});

// ===== API routes =====
app.get("/health", (_req, res) => res.json({ ok: true }));

// Stub API (works now). We'll wire your OpenAI Agent/Workflow in Step 5.
app.post("/api/run", async (req, res) => {
  try {
    const input = req.body?.input || "";
    // Replace this stub with a real agent call later.
    res.json({
      ok: true,
      result: {
        message: "Agent stub response",
        echo: input,
        tip: "Replace this with your Agent/Workflow call in Step 5."
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ===== serve built front-end (Vite /dist) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dist = path.join(__dirname, "dist");
app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on :${PORT}`));
