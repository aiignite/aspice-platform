import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "aspice-platform-secret-key";

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body;
    const userRepo = getRepository(User);

    const existing = await userRepo.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = userRepo.create({
      username,
      email,
      passwordHash,
      fullName,
    });

    await userRepo.save(user);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userRepo = getRepository(User);

    const user = await userRepo.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user.id, username: user.username, email: user.email, fullName: user.fullName });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
