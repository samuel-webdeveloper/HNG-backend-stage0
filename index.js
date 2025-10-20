import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

// Helper to fetch cat fact with timeout and graceful fallback
async function fetchCatFact() {
  try {
    const response = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000 // 5 seconds timeout
    });

    // API returns { fact: "...", length: ... }
    if (response && response.data && typeof response.data.fact === "string") {
      return { ok: true, fact: response.data.fact };
    }

    return { ok: false, fact: null };
  } catch (err) {
    console.warn("Cat Facts API fetch failed:", err.message || err);
    return { ok: false, fact: null };
  }
}

// GET /me endpoint
app.get("/me", async (req, res) => {
  // Prevent caching — ensures a fresh timestamp and fact each request
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const timestamp = new Date().toISOString();

  // Fetch cat fact
  const { ok, fact } = await fetchCatFact();

  // Use environment variables if provided, otherwise default placeholders
  const userEmail = process.env.USER_EMAIL || "your-email@example.com";
  const userName = process.env.USER_NAME || "Your Full Name";
  const userStack = process.env.USER_STACK || "Node.js/Express";

  if (!ok) {
    // Gracefully return success with fallback fact (keeps status 200)
    const fallbackFact = "Cat fact unavailable right now. Try again in a moment.";
    const payload = {
      status: "success",
      user: {
        email: userEmail,
        name: userName,
        stack: userStack
      },
      timestamp,
      fact: fallbackFact
    };
    console.log("Responding with fallback cat fact at", timestamp);
    return res.status(200).json(payload);
  }

  // Normal successful response
  const payload = {
    status: "success",
    user: {
      email: userEmail,
      name: userName,
      stack: userStack
    },
    timestamp,
    fact
  };

  return res.status(200).json(payload);
});

// A health check route (optional)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});