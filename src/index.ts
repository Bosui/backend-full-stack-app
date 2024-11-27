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
  origin: process.env.FRONTEND_URL || "*", // Nurodytas jūsų „frontend“ URL arba visi leidžiami šaltiniai
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Jei naudojate autentifikaciją per slapukus
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Sveikatos patikrinimo maršrutas (naudinga testavimui)
app.get("/", (req, res) => {
  res.send({ message: "Backend server is running" });
});

// Maršrutų nustatymai
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/businesses", businessRoutes);
app.use("/bookings", bookingRoutes);

// Prisijungimas prie duomenų bazės ir serverio paleidimas
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `Server running on ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`
      )
    );
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });

// 404 klaidos valdymas
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Klaidos valdymas
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
