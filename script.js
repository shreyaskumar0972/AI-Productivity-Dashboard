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
const WORK_TIME = 25*60;
const BREAK_TIME = 5*60;

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

        addStudyTime(25);

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

// STUDY PROGRESS
const DAILY_STUDY_GOAL = 4 * 60;

let studyData = JSON.parse(
    localStorage.getItem("studyData")
) || {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};

function saveStudyData() {
    localStorage.setItem(
        "studyData",
        JSON.stringify(studyData)
    );
}
function formatStudyTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
}
function updateStudyStatistic() {
    const studyTimeElement =
        document.getElementById("studyTime");

    const today = new Date().getDay();

    const todayMinutes = studyData[today] || 0;

    studyTimeElement.textContent =
        formatStudyTime(todayMinutes);
}
function renderStudyChart() {
    const studyBars =
        document.getElementById("studyBars");

    studyBars.innerHTML = "";

    const today = new Date().getDay();

    const mondayBasedData = [];

    for (let i = 1; i <= 7; i++) {
        const dayIndex = i === 7 ? 0 : i;

        mondayBasedData.push({
            dayIndex: dayIndex,
            minutes: studyData[dayIndex] || 0
        });
    }

    mondayBasedData.forEach(day => {
        const container =
            document.createElement("div");

        container.className =
            "study-bar-container";

        const bar =
            document.createElement("div");

        bar.className = "study-bar";

        const percentage =
            Math.min(
                (day.minutes / DAILY_STUDY_GOAL) * 100,
                100
            );

        bar.style.height =
            `${percentage}%`;

        const hours =
            document.createElement("div");

        hours.className = "study-hours";

        hours.textContent =
            formatStudyTime(day.minutes);

        container.appendChild(hours);
        container.appendChild(bar);

        studyBars.appendChild(container);
    });
}

function addStudyTime(minutes) {
    const today = new Date().getDay();

    studyData[today] =
        (studyData[today] || 0) + minutes;

    saveStudyData();

    updateStudyStatistic();
    renderStudyChart();
}
updateStudyStatistic();
renderStudyChart();

// Schedule Part
const defaultSchedule = [
    {
        id: 1,
        time: "09:00",
        title: "DBMS Lecture"
    },
    {
        id: 2,
        time: "11:00",
        title: "AI Lab"
    },
    {
        id: 3,
        time: "14:00",
        title: "Web Development"
    },
    {
        id: 4,
        time: "18:00",
        title: "Gym"
    }
];


function loadSchedule() {
    const savedSchedule =
        localStorage.getItem("productivitySchedule");

    if (savedSchedule) {
        return JSON.parse(savedSchedule);
    }

    return defaultSchedule;
}


let schedule = loadSchedule();


function saveSchedule() {
    localStorage.setItem(
        "productivitySchedule",
        JSON.stringify(schedule)
    );
}


function renderSchedule() {
    const scheduleList =
        document.getElementById("scheduleList");

    scheduleList.innerHTML = "";

    if (schedule.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "empty-schedule";

        emptyMessage.textContent =
            "No events scheduled for today.";

        scheduleList.appendChild(emptyMessage);

        return;
    }

    schedule
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach(event => {

            const row =
                document.createElement("div");

            row.className = "schedule-row";

            const time =
                document.createElement("span");

            time.className = "schedule-time";
            time.textContent = event.time;

            const title =
                document.createElement("span");

            title.className = "schedule-title";
            title.textContent = event.title;

            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-schedule";

            deleteButton.textContent =
                "Delete";

            deleteButton.addEventListener(
                "click",
                () => deleteScheduleEvent(event.id)
            );

            row.appendChild(time);
            row.appendChild(title);
            row.appendChild(deleteButton);

            scheduleList.appendChild(row);
        });
}


function addScheduleEvent() {
    const timeInput =
        document.getElementById("scheduleTime");

    const titleInput =
        document.getElementById("scheduleTitle");

    const time =
        timeInput.value;

    const title =
        titleInput.value.trim();

    if (time === "") {
        alert("Please select a time.");
        return;
    }

    if (title === "") {
        alert("Please enter an event title.");
        return;
    }

    const newEvent = {
        id: Date.now(),
        time: time,
        title: title
    };

    schedule.push(newEvent);

    saveSchedule();

    timeInput.value = "";
    titleInput.value = "";

    renderSchedule();
}


function deleteScheduleEvent(eventId) {
    schedule = schedule.filter(
        event => event.id !== eventId
    );

    saveSchedule();

    renderSchedule();
}


document
    .getElementById("addScheduleButton")
    .addEventListener(
        "click",
        addScheduleEvent
    );


document
    .getElementById("scheduleTitle")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                addScheduleEvent();
            }

        }
    );


renderSchedule();

// THEME TOGGLE
const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    themeToggle.querySelector("i");


function updateThemeIcon() {
    if (document.body.classList.contains("light")) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
}


function toggleTheme() {
    document.body.classList.toggle("light");

    const isLightMode =
        document.body.classList.contains("light");

    localStorage.setItem(
        "dashboardTheme",
        isLightMode ? "light" : "dark"
    );

    updateThemeIcon();
}


function loadTheme() {
    const savedTheme =
        localStorage.getItem("dashboardTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
    }

    updateThemeIcon();
}


themeToggle.addEventListener(
    "click",
    toggleTheme
);


loadTheme();