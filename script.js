// DYNAMIC GREETING

function updateGreeting() {
    const greetingElement = document.getElementById("greeting");
    const messageElement = document.getElementById("greetingMessage");

    const currentHour = new Date().getHours();

    let greeting;

    if (currentHour < 12) {
        greeting = "Good Morning!";
    } else if (currentHour < 18) {
        greeting = "Good Afternoon!";
    } else {
        greeting = "Good Evening!";
    }

    greetingElement.textContent = `${greeting} 👋`;
    messageElement.textContent =
        "Stay focused and make today productive.";
}

updateGreeting();

// TODO LIST

const defaultTasks = [
    {
        id: 1,
        title: "Finish DBMS project",
        completed: false
    },
    {
        id: 2,
        title: "Revise JavaScript",
        completed: true
    },
    {
        id: 3,
        title: "Read AI chapter",
        completed: false
    },
    {
        id: 4,
        title: "Workout",
        completed: false
    }
];

function loadTasks() {
    const savedTasks = localStorage.getItem("productivityTasks");

    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    return defaultTasks;
}

let tasks = loadTasks();

function saveTasks() {
    localStorage.setItem(
        "productivityTasks",
        JSON.stringify(tasks)
    );
}

function renderTasks() {
    const todoList = document.getElementById("todoList");

    todoList.innerHTML = "";

    tasks.forEach(task => {
        const taskElement = document.createElement("div");

        taskElement.className = "todo-item";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        taskElement.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <span>${task.title}</span>

            <button
                class="delete-task"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>
        `;

        todoList.appendChild(taskElement);
    });
}


function toggleTask(taskId) {
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderTasks();
    updateStatistics();
}


function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();

    renderTasks();
    updateStatistics();
}


function addTask() {
    const input = document.getElementById("taskInput");

    const taskTitle = input.value.trim();

    if (taskTitle === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    input.value = "";

    renderTasks();
    updateStatistics();
}


document
    .getElementById("addTaskButton")
    .addEventListener("click", addTask);


document
    .getElementById("taskInput")
    .addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });


renderTasks();

//Dashboard Statistics
function updateStatistics() {
    const taskCountElement =
        document.getElementById("taskCount");

    const pendingTasks = tasks.filter(
        task => !task.completed
    ).length;

    taskCountElement.textContent = pendingTasks;
}

updateStatistics();

//POMODORO TIMER
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeRemaining = WORK_TIME;
let timerInterval = null;
let isWorkSession = true;
let isRunning = false;

let completedSessions =
    Number(localStorage.getItem("completedPomodoros")) || 0;


const pomodoroClock =
    document.getElementById("pomodoroClock");

const timerMode =
    document.getElementById("timerMode");

const startTimerButton =
    document.getElementById("startTimerButton");

const pauseTimerButton =
    document.getElementById("pauseTimerButton");

const resetTimerButton =
    document.getElementById("resetTimerButton");

const sessionCount =
    document.getElementById("sessionCount");


function updateClockDisplay() {
    const minutes =
        Math.floor(timeRemaining / 60);

    const seconds =
        timeRemaining % 60;

    pomodoroClock.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function updateSessionCount() {
    sessionCount.textContent = completedSessions;
}


function startTimer() {
    if (isRunning) {
        return;
    }

    isRunning = true;

    timerInterval = setInterval(() => {
        timeRemaining--;

        updateClockDisplay();

        if (timeRemaining <= 0) {
            completeTimer();
        }
    }, 1000);
}


function pauseTimer() {
    if (!isRunning) {
        return;
    }

    clearInterval(timerInterval);

    timerInterval = null;
    isRunning = false;
}


function resetTimer() {
    clearInterval(timerInterval);

    timerInterval = null;
    isRunning = false;
    isWorkSession = true;
    timeRemaining = WORK_TIME;

    timerMode.textContent = "Work Session";

    updateClockDisplay();
}


function completeTimer() {
    clearInterval(timerInterval);

    timerInterval = null;
    isRunning = false;

    if (isWorkSession) {
        completedSessions++;

        localStorage.setItem(
            "completedPomodoros",
            completedSessions
        );

        updateSessionCount();

        alert("Work session complete! Time for a break.");

        isWorkSession = false;
        timeRemaining = BREAK_TIME;
        timerMode.textContent = "Break";

    } else {
        alert(
            "Break complete! Ready for another work session."
        );

        isWorkSession = true;
        timeRemaining = WORK_TIME;
        timerMode.textContent = "Work Session";
    }

    updateClockDisplay();
}


startTimerButton.addEventListener(
    "click",
    startTimer
);

pauseTimerButton.addEventListener(
    "click",
    pauseTimer
);

resetTimerButton.addEventListener(
    "click",
    resetTimer
);


updateClockDisplay();
updateSessionCount();