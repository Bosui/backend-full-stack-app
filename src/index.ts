import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import businessRoutes from "./routes/businessRoutes";
import categoryRoutes from "./routes/categoryRoutes";

// Įkrauname aplinkos kintamuosius
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Numatytasis port'as, jei `PORT` nėra nurodytas

// CORS konfigūracija
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // Leiskite užklausas tik iš nurodyto domeno
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Jei naudojate slapukus ar autentifikaciją
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Maršrutų nustatymai
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/businesses", businessRoutes);
app.use("/bookings", bookingRoutes);

// Prisijungimas prie duomenų bazės ir serverio paleidimas
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
