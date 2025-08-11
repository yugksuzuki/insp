const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // <-- IMPORTADO
require("dotenv").config();

const imageRoutes = require("./routes/imageRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(morgan("dev"));
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🖼️ Servir imagens da pasta public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected.");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

app.use("/api/images", imageRoutes);
app.use("/users", userRoutes);

const compareRoutes = require("./routes/compareRoutes");
app.use("/compare", compareRoutes);

// Health check
app.get("/health", (req, res) => res.send("OK"));

// Fallback 404
app.use("*", (req, res) => res.status(404).json({ error: "Not Found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Erro global:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});
