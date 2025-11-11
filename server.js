import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js";
import profileRoutes from "./src/routes/profileRoute.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all origins (development)
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log(`CORS enabled for all origins`);
  });
});
