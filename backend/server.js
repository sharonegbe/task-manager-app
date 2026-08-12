const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

let tasks = [
{
id: 1,
title: "Complete Codveda Internship Task 2",
completed: false,
category: "School Work"
}
];

let categories = [
"School Work",
"House Chores",
"Personal"
];


// ===============================
// TASKS
// ===============================

// Get all tasks
app.get("/tasks", (req, res) => {
res.json(tasks);
});


// Add a task
app.post("/tasks", (req, res) => {

const newTask = {
id: tasks.length + 1,
title: req.body.title,
completed: req.body.completed || false,
category: req.body.category || "Personal",
dueDate: req.body.dueDate || ""
};

tasks.push(newTask);

res.status(201).json({
message: "Task added successfully!",
task: newTask
});
});


// Update a task
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
task.category = req.body.category || task.category;
task.dueDate = req.body.dueDate || task.dueDate;
res.json({
message: "Task updated successfully!",
task: task
});
});


// Delete a task
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


// ===============================
// CATEGORIES
// ===============================

// Get categories
app.get("/categories", (req, res) => {
res.json(categories);
});


// Add category
app.post("/categories", (req, res) => {

const categoryName = req.body.name?.trim();

if (!categoryName) {
return res.status(400).json({
message: "Category name is required"
});
}

const alreadyExists = categories.some(
category => category.toLowerCase() === categoryName.toLowerCase()
);

if (alreadyExists) {
return res.status(400).json({
message: "Category already exists"
});
}

categories.push(categoryName);

res.status(201).json({
message: "Category added successfully!",
category: categoryName
});
});


// Delete category
app.delete("/categories/:name", (req, res) => {

const categoryName = decodeURIComponent(req.params.name);

const categoryIndex = categories.findIndex(
category => category.toLowerCase() === categoryName.toLowerCase()
);

if (categoryIndex === -1) {
return res.status(404).json({
message: "Category not found"
});
}

categories.splice(categoryIndex, 1);

// Move tasks belonging to deleted category to Personal
tasks.forEach(task => {
if (task.category.toLowerCase() === categoryName.toLowerCase()) {
task.category = "Personal";
}
});

res.json({
message: "Category deleted successfully!"
});
});


app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});