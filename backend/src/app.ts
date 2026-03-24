import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createConnection } from "typeorm";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import sprintRoutes from "./routes/sprints";
import { User, Project, Task, Sprint } from "./entities";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sprints", sprintRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Database connection and server start
async function start() {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "aspice_platform",
      entities: [User, Project, Task, Sprint],
      synchronize: true, // Auto-create tables (disable in production)
      logging: false,
    });
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    // Start without database for demo
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (no DB)`);
    });
  }
}

start();
