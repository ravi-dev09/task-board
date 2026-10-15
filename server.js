const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- tiny file-based "database" ----------
function readTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

const PRIORITIES = ["low", "medium", "high"];

// ---------- REST API ----------
// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const title = (req.body.title || "").trim();
  const priority = PRIORITIES.includes(req.body.priority) ? req.body.priority : "medium";

  if (!title) return res.status(400).json({ error: "Title is required." });
  if (title.length > 120) return res.status(400).json({ error: "Title must be 120 characters or fewer." });

  const task = { id: Date.now().toString(), title, priority, done: false, createdAt: new Date().toISOString() };
  const tasks = readTasks();
  tasks.unshift(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// Update a task (mark done / change title / change priority)
app.patch("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });

  if (typeof req.body.done === "boolean") task.done = req.body.done;
  if (typeof req.body.title === "string" && req.body.title.trim()) task.title = req.body.title.trim();
  if (PRIORITIES.includes(req.body.priority)) task.priority = req.body.priority;

  writeTasks(tasks);
  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const remaining = tasks.filter((t) => t.id !== req.params.id);
  if (remaining.length === tasks.length) return res.status(404).json({ error: "Task not found." });
  writeTasks(remaining);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`TaskBoard running at http://localhost:${PORT}`);
});
