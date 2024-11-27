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
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.LOCAL_FRONTEND_URL || "http://localhost:5173",
  process.env.PRODUCTION_FRONTEND_URL || "https://your-production-frontend.com",
];

console.log("Allowed origins:", allowedOrigins);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log(`Incoming request from origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS. Origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Backend server is running" });
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/businesses", businessRoutes);
app.use("/bookings", bookingRoutes);

connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
