const API_URL = "https://fluffy-eureka-r774r5r57vx92p6rw-3000.app.github.dev/tasks";

async function loadTasks() {
const response = await fetch(API_URL);
const tasks = await response.json();

const taskList = document.getElementById("taskList");
taskList.innerHTML = "";
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

totalTasks.textContent = tasks.length;
completedTasks.textContent = tasks.filter(task => task.completed).length;
tasks.forEach(task => {
const li = document.createElement("li");

li.innerHTML = `
<label class="task-item">
<input
type="checkbox"
${task.completed ? "checked" : ""}
onchange="toggleTask(${task.id}, this.checked)"
>

<span class="${task.completed ? "completed" : ""}">
${task.title}
</span>
</label>

<button onclick="deleteTask(${task.id})">
Delete
</button>
`;

taskList.appendChild(li);
});
}

loadTasks();

document.getElementById("addTaskBtn").addEventListener("click", async () => {
const input = document.getElementById("taskInput");

if (input.value.trim() === "") return;

await fetch(API_URL, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title: input.value,
completed: false
})
});

input.value = "";

loadTasks();
});


async function toggleTask(id, completed) {
await fetch(`${API_URL}/${id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
completed: completed
})
});

loadTasks();
}


async function deleteTask(id) {
await fetch(`${API_URL}/${id}`, {
method: "DELETE"
});

loadTasks();
}