const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Pinecone } = require("@pinecone-database/pinecone");
const Image = require("../models/Image");

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Inicialização correta do Pinecone com .init()
    const pinecone = new Pinecone();
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX);

    const images = await Image.find();

    if (!images.length) {
      console.log("Nenhuma imagem encontrada no banco.");
      return;
    }

    const vectors = images.map((img) => ({
      id: img._id.toString(),
      values: img.embedding,
      metadata: {
        label: img.label || "Produto",
        image_url: img.image_url,
        idMongo: img._id,
      },
    }));

    await index.upsert({ upsertRequest: { vectors } });

    console.log("Pinecone index populated com", vectors.length, "vetores!");
  } catch (err) {
    console.error("Erro ao popular Pinecone:", err);
  } finally {
    process.exit();
  }
})();

