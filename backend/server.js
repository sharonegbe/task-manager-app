const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const PORT = 3000;

let tasks = [
{ id: 1, title: "Complete Codveda Internship Task 2", completed: false }
];

app.get("/tasks", (req, res) => {
res.json(tasks);
});
app.post("/tasks", (req, res) => {
const newTask = {
id: tasks.length + 1,
title: req.body.title,
completed: req.body.completed
};
tasks.push(newTask);

res.status(201).json({
message: "Task added successfully!",
task: newTask
});
});
app.put("/tasks/:id", (req, res) => {
const taskId = parseInt(req.params.id);

const task = tasks.find(task => task.id === taskId);

if (!task) {
return res.status(404).json({
message: "Task not found"
});
}

task.title = req.body.title || task.title;
task.completed = req.body.completed ?? task.completed;

res.json({
message: "Task updated successfully!",
task: task
});
});
app.delete("/tasks/:id", (req, res) => {
const taskId = parseInt(req.params.id);

const taskIndex = tasks.findIndex(task => task.id === taskId);

if (taskIndex === -1) {
return res.status(404).json({
message: "Task not found"
});
}

tasks.splice(taskIndex, 1);

res.json({
message: "Task deleted successfully!"
});
});
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});