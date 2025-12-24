import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Conexão MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { autoIndex: true })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// Healthcheck
app.get("/", (req, res) => {
  res.json({ success: true, message: "StudyReels API Running" });
});

// Rotas principais
app.use("/api", router);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Rota não encontrada" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});