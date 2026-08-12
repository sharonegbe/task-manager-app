const API_URL = "https://fluffy-eureka-r774r5r57vx92p6rw-3000.app.github.dev/tasks";
// ===============================
// USER NAME
// ===============================

function setupUserName() {
let userName = localStorage.getItem("checkInUserName");

if (!userName) {
userName = prompt("Welcome to Check In! What is your name?");

if (userName && userName.trim() !== "") {
userName = userName.trim();
localStorage.setItem("checkInUserName", userName);
} else {
userName = "there";
}
}

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
welcomeMessage.textContent = `Hello ${userName}`;
}
}

setupUserName();

let selectedCategory="all";
let selectedSection= "tasks";

// ===============================
// MENU NAVIGATION
// ===============================

const menuLinks = document.querySelectorAll(".menu-link");

menuLinks.forEach(link => {
link.addEventListener("click", (event) => {
event.preventDefault();

// Remove active from all menu links
menuLinks.forEach(item => {
item.classList.remove("active");
});

// Make clicked menu link active
link.classList.add("active");

const section = link.dataset.section;

if (section === "tasks") {
selectedSection = "tasks";
loadTasks();
}

if (section === "today") {
selectedSection = "today";
loadTasks();
}

if (section === "upcoming") {
selectedSection = "upcoming";
loadTasks();
}

if (section === "analytics") {
loadAnalytics();
}

if (section === "settings") {
alert("Settings section coming next!");
}
});
});


// ===============================
// CURRENT DATE
// ===============================

const currentDate = document.getElementById("currentDate");

function updateDate() {
const today = new Date();

const formattedDate = today.toLocaleDateString("en-US", {
weekday: "long",
day: "numeric",
month: "long"
});

currentDate.textContent = formattedDate;
}
updateDate();

async function loadTasks() {
const response = await fetch(API_URL);
const tasks = await response.json();

const searchInput = document.getElementById("searchInput");
const searchTerm = searchInput
? searchInput.value.toLowerCase().trim()
: "";

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayString =
`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const filteredTasks = tasks.filter(task => {

// Search filter
const matchesSearch = task.title
.toLowerCase()
.includes(searchTerm);

// Category filter
const matchesCategory =
selectedCategory === "all" ||
task.category === selectedCategory;

// Menu filter
let matchesSection = true;

if (selectedSection === "today") {
matchesSection = task.dueDate === todayString;
}

if (selectedSection === "upcoming") {
matchesSection =
task.dueDate &&
task.dueDate > todayString;
}

return matchesSearch && matchesCategory && matchesSection;
});

const taskList = document.getElementById("taskList");

taskList.innerHTML = "";

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

totalTasks.textContent = filteredTasks.length;

completedTasks.textContent =
filteredTasks.filter(task => task.completed).length;

filteredTasks.forEach(task => {

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

<span class="task-category category-${task.category
.toLowerCase()
.replace(/\s+/g, "-")}">
${task.category}
</span>

</label>

<button onclick="deleteTask(${task.id})">
Delete
</button>
`;

taskList.appendChild(li);
});
}


function getCategoryClass(category) {
if (!category) return "category-personal";

const categoryMap = {
"School Work": "category-school",
"House Chores": "category-chores",
"Personal": "category-personal",
"Job": "category-job",
"Business": "category-business",
"Other": "category-other"
};

return categoryMap[category] || "category-personal";
}

// ===============================
// TASK ANALYTICS
// ===============================

async function loadAnalytics() {

const response = await fetch(API_URL);
const tasks = await response.json();

const total = tasks.length;

const completed = tasks.filter(task => task.completed).length;

const pending = total - completed;

const completionRate =
total === 0
? 0
: Math.round((completed / total) * 100);

// Main statistics
document.getElementById("analyticsTotal").textContent = total;

document.getElementById("analyticsCompleted").textContent =
completed;

document.getElementById("analyticsPending").textContent =
pending;

document.getElementById("analyticsRate").textContent =
`${completionRate}%`;

// Category counts
document.getElementById("analyticsSchool").textContent =
tasks.filter(task => task.category === "School Work").length;

document.getElementById("analyticsChores").textContent =
tasks.filter(task => task.category === "House Chores").length;

document.getElementById("analyticsPersonal").textContent =
tasks.filter(task => task.category === "Personal").length;

document.getElementById("analyticsJob").textContent =
tasks.filter(task => task.category === "Job").length;

document.getElementById("analyticsBusiness").textContent =
tasks.filter(task => task.category === "Business").length;

document.getElementById("analyticsOther").textContent =
tasks.filter(task => task.category === "Other").length;
}

loadTasks();
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
loadTasks();
});

// ===============================
// CATEGORY FILTERS
// ===============================

const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
button.addEventListener("click", () => {

categoryButtons.forEach(btn => {
btn.classList.remove("active");
});

button.classList.add("active");

const category = button.dataset.category;

const categoryMap = {
all: "all",
school: "School Work",
chores: "House Chores",
personal: "Personal",
job: "Job",
business: "Business",
other: "Other"
};

selectedCategory = categoryMap[category];

loadTasks();
});
});
document.getElementById("addTaskBtn").addEventListener("click", async () => {

const input = document.getElementById("taskInput");
const category = document.getElementById("taskCategory");
const dueDate = document.getElementById("taskDueDate");
if (input.value.trim() === "") {
return;
}

const selectedCategory = category
? category.value
: "Personal";

await fetch(API_URL, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title: input.value.trim(),
completed: false,
category: selectedCategory,
dueDate: dueDate.value
})
});

input.value = "";

await loadTasks();
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
// ===============================
// FOCUS TIMER
// ===============================

let timerInterval;
let timeLeft = 25 * 60;
let timerRunning = false;

const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const stopTimerBtn = document.getElementById("stopTimerBtn");
const timerModes = document.querySelectorAll(".timer-mode");

// Update the timer display
function updateTimerDisplay() {
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;

timerDisplay.textContent =
`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Start / Pause timer
startTimerBtn.addEventListener("click", () => {

if (timerRunning) {
clearInterval(timerInterval);
timerRunning = false;
startTimerBtn.textContent = "▶ Start";
return;
}

timerRunning = true;
startTimerBtn.textContent = "⏸ Pause";

timerInterval = setInterval(() => {

if (timeLeft <= 0) {
clearInterval(timerInterval);
timerRunning = false;
startTimerBtn.textContent = "▶ Start";

playTimerSound();

return;
}

timeLeft--;
updateTimerDisplay();

}, 1000);

});

function playTimerSound() {
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

oscillator.frequency.value = 800;
oscillator.type = "sine";

gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

oscillator.start();

oscillator.stop(audioContext.currentTime + 0.5);
}


// 👇 PUT THE STOP CODE HERE

stopTimerBtn.addEventListener("click", () => {

clearInterval(timerInterval);

timerRunning = false;

startTimerBtn.textContent = "▶ Start";

const activeMode = document.querySelector(".timer-mode.active");

if (activeMode) {

if (activeMode.textContent.trim() === "Timer") {
timeLeft = 25 * 60;

} else if (activeMode.textContent.trim() === "Short Break") {
timeLeft = 5 * 60;

} else if (activeMode.textContent.trim() === "Long Break") {
timeLeft = 15 * 60;
}
}

updateTimerDisplay();
});

// Timer modes
timerModes.forEach((button, index) => {

button.addEventListener("click", () => {

// Stop current timer
clearInterval(timerInterval);
timerRunning = false;
startTimerBtn.textContent = "▶ Start";

// Remove active state
timerModes.forEach(btn => btn.classList.remove("active"));

// Add active state
button.classList.add("active");

// Set timer duration
if (index === 0) {
// Timer
timeLeft = 25 * 60;
} else if (index === 1) {
// Short Break
timeLeft = 5 * 60;
} else if (index === 2) {
// Long Break
timeLeft = 15 * 60;
} else if (index === 3) {
// Custom Timer
const customMinutes = prompt("How many minutes would you like?");

if (customMinutes && customMinutes > 0) {
timeLeft = Number(customMinutes) * 60;
} else {
return;
}
}

updateTimerDisplay();
});
});


// Initial display
updateTimerDisplay();