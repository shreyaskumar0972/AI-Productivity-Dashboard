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

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

function searchDashboard() {
    const query = searchInput.value.trim().toLowerCase();

    searchResults.innerHTML = "";

    if (query === "") {
        searchResults.style.display = "none";
        return;
    }

    const results = [];

    // Search tasks
    tasks.forEach(task => {
    const taskText = task.text || task.title || task.name || "";

        if (taskText.toLowerCase().includes(query)) {
            results.push({
                type: "Task",
                title: taskText
            });
        }
    });

    // Search schedule
    schedule.forEach(event => {
        const eventTitle = event.title || event.name || "";
        const eventTime = event.time || "";

        if (
            eventTitle.toLowerCase().includes(query) ||
            eventTime.includes(query)
        ){
            results.push({
                type: "Schedule",
                title: `${eventTime} — ${eventTitle}`
            });
        }
    });

    // Display results
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                No results found
            </div>
        `;
    } else {
        results.forEach(result => {
            searchResults.innerHTML += `
                <div class="search-result">
                    <div class="search-result-type">
                        ${result.type}
                    </div>

                    <div class="search-result-title">
                        ${result.title}
                    </div>
                </div>
            `;
        });
    }

    searchResults.style.display = "block";
}

searchInput.addEventListener("input", searchDashboard);

// WEATHER

const weatherTemperature = document.getElementById("weatherTemperature");
const weatherIcon = document.getElementById("weatherIcon");
const weatherLocation = document.getElementById("weatherLocation");
const weatherFeelsLike = document.getElementById("weatherFeelsLike");
const weatherHumidity = document.getElementById("weatherHumidity");
const weatherStatus = document.getElementById("weatherStatus");

async function loadWeather() {
    try {
        // Phagwara, Punjab coordinates
        const latitude = 31.224;
        const longitude = 75.770;

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
            `&timezone=Asia%2FKolkata`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const data = await response.json();

        const currentWeather = data.current;

        const temperature = Math.round(currentWeather.temperature_2m);
        const feelsLike = Math.round(currentWeather.apparent_temperature);
        const humidity = currentWeather.relative_humidity_2m;
        const weatherCode = currentWeather.weather_code;

        weatherTemperature.textContent = `${temperature}°C`;
        weatherFeelsLike.textContent = `Feels like ${feelsLike}°C`;
        weatherHumidity.textContent = `Humidity ${humidity}%`;
        weatherLocation.textContent = "Phagwara, Punjab";

        weatherStatus.textContent = getWeatherDescription(weatherCode);
        weatherIcon.textContent = getWeatherIcon(weatherCode);

    } catch (error) {
        console.error("Weather error:", error);

        weatherTemperature.textContent = "--°C";
        weatherFeelsLike.textContent = "Feels like --°C";
        weatherHumidity.textContent = "Humidity --%";
        weatherLocation.textContent = "Phagwara, Punjab";
        weatherStatus.textContent = "Unable to load weather";
        weatherIcon.textContent = "⚠️";
    }
}

function getWeatherDescription(code) {
    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if ([45, 48].includes(code)) {
        return "Foggy";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "Drizzle";
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return "Rain";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "Snow";
    }

    if ([80, 81, 82].includes(code)) {
        return "Rain showers";
    }

    if ([95, 96, 99].includes(code)) {
        return "Thunderstorm";
    }

    return "Unknown weather";
}

function getWeatherIcon(code) {
    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if ([45, 48].includes(code)) {
        return "🌫️";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "🌦️";
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return "🌧️";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "❄️";
    }

    if ([80, 81, 82].includes(code)) {
        return "🌦️";
    }

    if ([95, 96, 99].includes(code)) {
        return "⛈️";
    }

    return "🌡️";
}
loadWeather();

// ATTENDANCE

const attendancePercentage =
    document.getElementById("attendancePercentage");

const presentCount =
    document.getElementById("presentCount");

const absentCount =
    document.getElementById("absentCount");

const presentButton =
    document.getElementById("presentButton");

const absentButton =
    document.getElementById("absentButton");

const resetAttendanceButton =
    document.getElementById("resetAttendanceButton");

const defaultAttendance = {
    present: 23,
    absent: 2
};

function loadAttendance() {
    const savedAttendance =
        localStorage.getItem("attendanceData");

    if (savedAttendance) {
        return JSON.parse(savedAttendance);
    }

    return defaultAttendance;
}

let attendance = loadAttendance();

function saveAttendance() {
    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendance)
    );
}

function updateAttendance() {
    const totalClasses =
        attendance.present + attendance.absent;

    let percentage = 0;

    if (totalClasses > 0) {
        percentage =
            (attendance.present / totalClasses) * 100;
    }

    attendancePercentage.textContent =
        `${percentage.toFixed(1)}%`;

    presentCount.textContent =
        attendance.present;

    absentCount.textContent =
        attendance.absent;
}

function markPresent() {
    attendance.present++;

    saveAttendance();
    updateAttendance();
}

function markAbsent() {
    attendance.absent++;

    saveAttendance();
    updateAttendance();
}

function resetAttendance() {
    const confirmReset = confirm(
        "Are you sure you want to reset attendance?"
    );

    if (!confirmReset) {
        return;
    }

    attendance = {
        present: 0,
        absent: 0
    };

    saveAttendance();
    updateAttendance();
}

presentButton.addEventListener(
    "click",
    markPresent
);

absentButton.addEventListener(
    "click",
    markAbsent
);

resetAttendanceButton.addEventListener(
    "click",
    resetAttendance
);

updateAttendance();

// ASSIGNMENTS

const assignmentTitle =
    document.getElementById("assignmentTitle");

const assignmentDueDate =
    document.getElementById("assignmentDueDate");

const addAssignmentButton =
    document.getElementById("addAssignmentButton");

const assignmentList =
    document.getElementById("assignmentList");

const assignmentCount =
    document.getElementById("assignmentCount");

const defaultAssignments = [
    {
        id: 1,
        title: "DBMS Project",
        dueDate: "2026-09-05",
        completed: false
    },
    {
        id: 2,
        title: "AI Research Paper",
        dueDate: "2026-09-08",
        completed: false
    }
];

function loadAssignments() {
    const savedAssignments =
        localStorage.getItem("productivityAssignments");

    if (savedAssignments) {
        return JSON.parse(savedAssignments);
    }

    return defaultAssignments;
}

let assignments = loadAssignments();

function saveAssignments() {
    localStorage.setItem(
        "productivityAssignments",
        JSON.stringify(assignments)
    );
}

function renderAssignments() {
    assignmentList.innerHTML = "";

    if (assignments.length === 0) {
        assignmentList.innerHTML = `
            <div class="empty-assignment">
                No assignments yet.
            </div>
        `;

        updateAssignmentCount();
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    assignments.forEach(assignment => {
        const dueDate = new Date(
            assignment.dueDate + "T00:00:00"
        );

        const isOverdue =
            !assignment.completed &&
            dueDate < today;

        const item = document.createElement("div");

        item.className = "assignment-item";

        if (assignment.completed) {
            item.classList.add("completed-assignment");
        }

        if (isOverdue) {
            item.classList.add("overdue-assignment");
        }

        item.innerHTML = `
            <div class="assignment-info">

                <div class="assignment-title">
                    ${assignment.title}
                </div>

                <div class="assignment-date">
                    Due: ${assignment.dueDate}
                </div>

                ${
                    isOverdue
                        ? `<div class="overdue-label">OVERDUE</div>`
                        : ""
                }

            </div>

            <div class="assignment-actions">

                <button
                    class="complete-assignment"
                    onclick="toggleAssignment(${assignment.id})"
                >
                    ${assignment.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="delete-assignment"
                    onclick="deleteAssignment(${assignment.id})"
                >
                    Delete
                </button>

            </div>
        `;

        assignmentList.appendChild(item);
    });

    updateAssignmentCount();
}

function updateAssignmentCount() {
    const pendingAssignments =
        assignments.filter(
            assignment => !assignment.completed
        ).length;

    assignmentCount.textContent =
        pendingAssignments;
}

function toggleAssignment(id) {
    const assignment =
        assignments.find(
            assignment => assignment.id === id
        );

    if (!assignment) {
        return;
    }

    assignment.completed =
        !assignment.completed;

    saveAssignments();
    renderAssignments();
}

function deleteAssignment(id) {
    assignments =
        assignments.filter(
            assignment => assignment.id !== id
        );

    saveAssignments();
    renderAssignments();
}

function addAssignment() {
    const title =
        assignmentTitle.value.trim();

    const dueDate =
        assignmentDueDate.value;

    if (title === "") {
        alert("Please enter an assignment title.");
        return;
    }

    if (dueDate === "") {
        alert("Please select a due date.");
        return;
    }

    const newAssignment = {
        id: Date.now(),
        title: title,
        dueDate: dueDate,
        completed: false
    };

    assignments.push(newAssignment);

    saveAssignments();
    renderAssignments();

    assignmentTitle.value = "";
    assignmentDueDate.value = "";
}

addAssignmentButton.addEventListener(
    "click",
    addAssignment
);

assignmentTitle.addEventListener(
    "keydown",
    event => {
        if (event.key === "Enter") {
            addAssignment();
        }
    }
);

renderAssignments();

// SMART MOTIVATION

const motivationMessage =
    document.getElementById("motivationMessage");

const newMotivationButton =
    document.getElementById("newMotivationButton");

const motivationMessages = [
    "Small progress is still progress. Keep moving forward.",
    "Focus on one important task at a time.",
    "You don't need to finish everything today. Just make meaningful progress.",
    "A focused 25 minutes can make a bigger difference than you think.",
    "Consistency beats motivation. Keep showing up.",
    "Your future self will thank you for the work you do today.",
    "Start with the easiest task and build momentum.",
    "Don't wait for the perfect time. Start now."
];
function getSmartMotivation() {
    const pendingTasks =
        tasks.filter(task => !task.completed).length;

    const pendingAssignments =
        assignments.filter(
            assignment => !assignment.completed
        ).length;

    const overdueAssignments =
        assignments.filter(assignment => {
            if (assignment.completed) {
                return false;
            }

            const dueDate =
                new Date(assignment.dueDate + "T00:00:00");

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return dueDate < today;
        }).length;

    const todayStudyMinutes =
        studyData[new Date().getDay()] || 0;


    // Priority 1: overdue assignments
    if (overdueAssignments > 0) {
        return `You have ${overdueAssignments} overdue assignment${overdueAssignments > 1 ? "s" : ""}. Let's clear the most urgent one first.`;
    }


    // Priority 2: tasks
    if (pendingTasks >= 5) {
        return `You have ${pendingTasks} pending tasks. Don't tackle everything at once — pick one and get started.`;
    }


    // Priority 3: study
    if (todayStudyMinutes === 0) {
        return "You haven't studied yet today. Start with one 25-minute focused session.";
    }


    // Priority 4: assignments
    if (pendingAssignments > 0) {
        return `You have ${pendingAssignments} assignment${pendingAssignments > 1 ? "s" : ""} waiting for you. Keep making progress.`;
    }


    // Otherwise use a random motivation
    const randomIndex =
        Math.floor(
            Math.random() * motivationMessages.length
        );

    return motivationMessages[randomIndex];
}

function updateMotivation() {
    motivationMessage.textContent =
        getSmartMotivation();
}
updateMotivation();

newMotivationButton.addEventListener(
    "click",
    updateMotivation
);