import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import V1AuthRoutes from "./routes/authRoutes";
import sequelize from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", V1AuthRoutes);

try {
  async function bootstrap() {
    await sequelize.authenticate();
    console.log("Database connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
  bootstrap();
} catch (error) {
  console.error("Error connecting to the database:", error);
}
