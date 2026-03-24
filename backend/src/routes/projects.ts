import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Project } from "../entities";
import { authenticate } from "../middleware/auth";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const projectRepo = getRepository(Project);
    const projects = await projectRepo.find({
      relations: ["owner"],
      order: { createdAt: "DESC" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get single project
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const projectRepo = getRepository(Project);
    const project = await projectRepo.findOne({
      where: { id: req.params.id },
      relations: ["owner"],
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Create project
router.post("/", async (req: Request, res: Response) => {
  try {
    const projectRepo = getRepository(Project);
    const project = projectRepo.create(req.body);
    await projectRepo.save(project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Update project
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const projectRepo = getRepository(Project);
    const project = await projectRepo.findOne({ where: { id: req.params.id } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    Object.assign(project, req.body);
    await projectRepo.save(project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const projectRepo = getRepository(Project);
    const project = await projectRepo.findOne({ where: { id: req.params.id } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    await projectRepo.remove(project);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
