import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
const connect = process.env.STRING_CONNECTION_DB || "mongodb://localhost:27017/studyreels";
mongoose
  .connect(connect, { autoIndex: true })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro MongoDB:", err));

app.get("/", (req, res) => {
  res.json({ success: true, message: "StudyReels API Running" });
});

app.use("/api", router);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Rota não encontrada" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${port}`);
});