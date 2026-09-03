import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import TodoList from "./components/TodoList";
import Schedule from "./components/Schedule";
import Pomodoro from "./components/Pomodoro";
import StudyProgress from "./components/StudyProgress";
import Attendance from "./components/Attendance";
import Assignments from "./components/Assignments";
import Weather from "./components/Weather";
import Motivation from "./components/Motivation";
import Notifications from "./components/Notifications";
import "./App.css";

function loadStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) return `${remaining}m`;
    if (remaining === 0) return `${hours}h`;

    return `${hours}h ${remaining}m`;
}

function App() {
    const [tasks, setTasks] = useState(() =>
        loadStorage("reactTasks", [])
    );

    const [schedule, setSchedule] = useState(() =>
        loadStorage("reactSchedule", [])
    );

    const [assignments, setAssignments] = useState(() =>
        loadStorage("reactAssignments", [])
    );

    const [attendance, setAttendance] = useState(() =>
        loadStorage("reactAttendance", {
            present: 0,
            absent: 0,
        })
    );

    const [studyData, setStudyData] = useState(() =>
        loadStorage("reactStudyData", {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        })
    );

    const [lightMode, setLightMode] = useState(() => {
        return localStorage.getItem("reactTheme") === "light";
    });

    const [search, setSearch] = useState("");
    const [notificationsOpen, setNotificationsOpen] =
        useState(false);

    useEffect(() => {
        localStorage.setItem("reactTasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem(
            "reactSchedule",
            JSON.stringify(schedule)
        );
    }, [schedule]);

    useEffect(() => {
        localStorage.setItem(
            "reactAssignments",
            JSON.stringify(assignments)
        );
    }, [assignments]);

    useEffect(() => {
        localStorage.setItem(
            "reactAttendance",
            JSON.stringify(attendance)
        );
    }, [attendance]);

    useEffect(() => {
        localStorage.setItem(
            "reactStudyData",
            JSON.stringify(studyData)
        );
    }, [studyData]);

    useEffect(() => {
        localStorage.setItem(
            "reactTheme",
            lightMode ? "light" : "dark"
        );
    }, [lightMode]);

    const todayIndex = new Date().getDay();
    const todayStudyMinutes = studyData[todayIndex] || 0;

    const addStudyTime = useCallback((minutes) => {
        const day = new Date().getDay();

        setStudyData((current) => ({
            ...current,
            [day]: (current[day] || 0) + minutes,
        }));
    }, []);

    const pendingTasks =
        tasks.filter((task) => !task.completed).length;

    const pendingAssignments =
        assignments.filter(
            (assignment) => !assignment.completed
        ).length;

    const attendanceTotal =
        attendance.present + attendance.absent;

    const attendancePercentage =
        attendanceTotal === 0
            ? 0
            : (
                  (attendance.present / attendanceTotal) *
                  100
              ).toFixed(1);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning!";
        if (hour < 18) return "Good Afternoon!";

        return "Good Evening!";
    }, []);

    const notifications = useMemo(() => {
        const result = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        assignments.forEach((assignment) => {
            if (assignment.completed) return;

            const due = new Date(
                `${assignment.dueDate}T00:00:00`
            );

            if (due < today) {
                result.push({
                    title: "🔴 Assignment overdue",
                    message: `${assignment.title} was due on ${assignment.dueDate}.`,
                });
            }
        });

        if (todayStudyMinutes === 0) {
            result.push({
                title: "📚 Study reminder",
                message: "You haven't studied today yet.",
            });
        }

        const now = new Date();
        const currentMinutes =
            now.getHours() * 60 + now.getMinutes();

        schedule.forEach((event) => {
            const [hours, minutes] =
                event.time.split(":").map(Number);

            const eventMinutes =
                hours * 60 + minutes;

            const difference =
                eventMinutes - currentMinutes;

            if (difference >= 0 && difference <= 60) {
                result.push({
                    title: "📅 Upcoming event",
                    message: `${event.title} starts at ${event.time}.`,
                });
            }
        });

        return result;
    }, [
        assignments,
        schedule,
        todayStudyMinutes,
    ]);

    const searchResults = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return [];

        const taskResults = tasks
            .filter((task) =>
                task.text.toLowerCase().includes(query)
            )
            .map((task) => ({
                type: "Task",
                text: task.text,
            }));

        const scheduleResults = schedule
            .filter(
                (event) =>
                    event.title.toLowerCase().includes(query) ||
                    event.time.includes(query)
            )
            .map((event) => ({
                type: "Schedule",
                text: `${event.time} — ${event.title}`,
            }));

        return [...taskResults, ...scheduleResults];
    }, [search, tasks, schedule]);

    return (
        <div className={lightMode ? "app light" : "app"}>
            <Sidebar />

            <main className="main-content">
                <Topbar
                    search={search}
                    setSearch={setSearch}
                    lightMode={lightMode}
                    setLightMode={setLightMode}
                    notificationCount={notifications.length}
                    onNotificationClick={() =>
                        setNotificationsOpen(
                            !notificationsOpen
                        )
                    }
                />

                <Notifications
                    notifications={notifications}
                    open={notificationsOpen}
                    onClose={() =>
                        setNotificationsOpen(false)
                    }
                />

                {search.trim() && (
                    <div className="search-results">
                        {searchResults.length === 0 ? (
                            <p>No results found.</p>
                        ) : (
                            searchResults.map((result, index) => (
                                <div
                                    className="search-result"
                                    key={`${result.type}-${index}`}
                                >
                                    <small>{result.type}</small>
                                    <div>{result.text}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <section className="welcome">
                    <h1>{greeting} 👋</h1>
                    <p>
                        Stay focused and make today productive.
                    </p>
                </section>

                <section className="stats-grid">
                    <StatCard
                        title="Attendance"
                        value={`${attendancePercentage}%`}
                        subtitle={`${attendance.present} present · ${attendance.absent} absent`}
                        className="attendance-card"
                    />

                    <StatCard
                        title="Assignments"
                        value={pendingAssignments}
                        subtitle={
                            pendingAssignments === 1
                                ? "1 assignment remaining"
                                : `${pendingAssignments} assignments remaining`
                        }
                        className="assignment-card"
                    />

                    <StatCard
                        title="Study"
                        value={formatMinutes(todayStudyMinutes)}
                        subtitle={`${formatMinutes(
                            Math.max(
                                240 - todayStudyMinutes,
                                0
                            )
                        )} left today`}
                        className="study-card"
                    />

                    <StatCard
                        title="Tasks"
                        value={pendingTasks}
                        subtitle={
                            pendingTasks === 1
                                ? "1 task remaining"
                                : `${pendingTasks} tasks remaining`
                        }
                        className="tasks-card"
                    />
                </section>

                <section className="dashboard-grid">
                    <Schedule
                        schedule={schedule}
                        setSchedule={setSchedule}
                    />

                    <TodoList
                        tasks={tasks}
                        setTasks={setTasks}
                    />

                    <StudyProgress studyData={studyData} />

                    <Pomodoro
                        onWorkComplete={addStudyTime}
                    />

                    <Weather />

                    <Attendance
                        attendance={attendance}
                        setAttendance={setAttendance}
                    />

                    <Assignments
                        assignments={assignments}
                        setAssignments={setAssignments}
                    />

                    <Motivation
                        tasks={tasks}
                        assignments={assignments}
                        studyMinutes={todayStudyMinutes}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;