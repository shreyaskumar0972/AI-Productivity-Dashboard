import { useState } from "react";

const messages = [
    "Small progress is still progress. Keep moving forward.",
    "Focus on one important task at a time.",
    "A focused 25 minutes can make a bigger difference than you think.",
    "Consistency beats motivation. Keep showing up.",
    "Your future self will thank you for the work you do today.",
];

function Motivation({ tasks, assignments, studyMinutes }) {
    const [randomIndex, setRandomIndex] = useState(0);

    function getMessage() {
        const overdue = assignments.filter((assignment) => {
            if (assignment.completed) return false;

            const due = new Date(`${assignment.dueDate}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return due < today;
        }).length;

        const pendingTasks =
            tasks.filter((task) => !task.completed).length;

        if (overdue > 0) {
            return `You have ${overdue} overdue assignment${
                overdue === 1 ? "" : "s"
            }. Handle the most urgent one first.`;
        }

        if (pendingTasks >= 5) {
            return `You have ${pendingTasks} pending tasks. Pick one and start there.`;
        }

        if (studyMinutes === 0) {
            return "You haven't studied today. Start with one focused Pomodoro session.";
        }

        return messages[randomIndex];
    }

    function newMessage() {
        setRandomIndex(
            Math.floor(Math.random() * messages.length)
        );
    }

    return (
        <section className="panel">
            <h2>💡 Motivation</h2>

            <blockquote>{getMessage()}</blockquote>

            <button onClick={newMessage}>
                New Motivation
            </button>
        </section>
    );
}

export default Motivation;