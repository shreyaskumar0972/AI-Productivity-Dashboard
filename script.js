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

let tasks = [
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

    renderTasks();
    updateStatistics();
}


function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

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