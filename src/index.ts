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

// Middleware
app.use(express.json());
app.use(cors());

// Maršrutų nustatymai
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/businesses", businessRoutes);
app.use("/bookings", bookingRoutes);

// Prisijungimas prie duomenų bazės ir serverio paleidimas
connectDB() // Čia turėtų būti teisingas importuotas `connectDB`
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
