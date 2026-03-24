import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Task } from "../entities";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// Get tasks by project
router.get("/project/:projectId", async (req: Request, res: Response) => {
  try {
    const taskRepo = getRepository(Task);
    const tasks = await taskRepo.find({
      where: { projectId: req.params.projectId },
      relations: ["assignee"],
      order: { orderIndex: "ASC" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get single task
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const taskRepo = getRepository(Task);
    const task = await taskRepo.findOne({
      where: { id: req.params.id },
      relations: ["assignee", "project"],
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Create task
router.post("/", async (req: Request, res: Response) => {
  try {
    const taskRepo = getRepository(Task);
    const task = taskRepo.create(req.body);
    await taskRepo.save(task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const taskRepo = getRepository(Task);
    const task = await taskRepo.findOne({ where: { id: req.params.id } });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    Object.assign(task, req.body);
    await taskRepo.save(task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const taskRepo = getRepository(Task);
    const task = await taskRepo.findOne({ where: { id: req.params.id } });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await taskRepo.remove(task);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Batch update task status (for kanban drag-drop)
router.post("/batch-status", async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;
    const taskRepo = getRepository(Task);

    for (const taskUpdate of tasks) {
      await taskRepo.update(taskUpdate.id, {
        status: taskUpdate.status,
        orderIndex: taskUpdate.orderIndex,
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to batch update tasks" });
  }
});

export default router;
