import { useEffect, useState } from "react";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function Pomodoro({ onWorkComplete }) {
    const [timeRemaining, setTimeRemaining] = useState(WORK_TIME);
    const [running, setRunning] = useState(false);
    const [workSession, setWorkSession] = useState(true);
    const [sessions, setSessions] = useState(() => {
        return Number(localStorage.getItem("completedPomodoros")) || 0;
    });

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setTimeRemaining((time) => {
                if (time <= 1) {
                    setRunning(false);

                    if (workSession) {
                        setSessions((count) => {
                            const updated = count + 1;
                            localStorage.setItem(
                                "completedPomodoros",
                                updated
                            );
                            return updated;
                        });

                        onWorkComplete(25);
                    }

                    setWorkSession((current) => !current);

                    return workSession ? BREAK_TIME : WORK_TIME;
                }

                return time - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [running, workSession, onWorkComplete]);

    function resetTimer() {
        setRunning(false);
        setTimeRemaining(workSession ? WORK_TIME : BREAK_TIME);
    }

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <section className="panel timer-panel">
            <h2>Pomodoro</h2>

            <div className="clock">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
            </div>

            <p>{workSession ? "Work Session" : "Break Session"}</p>

            <div className="button-row">
                <button onClick={() => setRunning(true)}>Start</button>
                <button onClick={() => setRunning(false)}>Pause</button>
                <button onClick={resetTimer}>Reset</button>
            </div>

            <p>
                Completed Sessions: <strong>{sessions}</strong>
            </p>
        </section>
    );
}

export default Pomodoro;