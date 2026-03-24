import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Sprint } from "../entities";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// Get sprints by project
router.get("/project/:projectId", async (req: Request, res: Response) => {
  try {
    const sprintRepo = getRepository(Sprint);
    const sprints = await sprintRepo.find({
      where: { projectId: req.params.projectId },
      order: { startDate: "ASC" },
    });
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sprints" });
  }
});

// Create sprint
router.post("/", async (req: Request, res: Response) => {
  try {
    const sprintRepo = getRepository(Sprint);
    const sprint = sprintRepo.create(req.body);
    await sprintRepo.save(sprint);
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sprint" });
  }
});

// Update sprint
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const sprintRepo = getRepository(Sprint);
    const sprint = await sprintRepo.findOne({ where: { id: req.params.id } });
    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }
    Object.assign(sprint, req.body);
    await sprintRepo.save(sprint);
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sprint" });
  }
});

export default router;
