import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { processQuery } from "./processQuery.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
const port = 3000;
app.post("/api/prompt", (req, res) => {
  const { prompt } = req.body;

  const url = "http://localhost:11434/api/generate";

  processQuery(url, prompt)
    .then((message) => res.json({ message }))
    .catch((err) => res.status(500).json({ message: "Error: " + err.message }));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
