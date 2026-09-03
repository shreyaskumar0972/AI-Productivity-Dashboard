import { useState } from "react";

function Assignments({ assignments, setAssignments }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");

    function addAssignment() {
        if (!title.trim() || !dueDate) return;

        setAssignments([
            ...assignments,
            {
                id: Date.now(),
                title: title.trim(),
                dueDate,
                completed: false,
            },
        ]);

        setTitle("");
        setDueDate("");
    }

    function toggleAssignment(id) {
        setAssignments(
            assignments.map((assignment) =>
                assignment.id === id
                    ? {
                          ...assignment,
                          completed: !assignment.completed,
                      }
                    : assignment
            )
        );
    }

    function deleteAssignment(id) {
        setAssignments(
            assignments.filter((assignment) => assignment.id !== id)
        );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <section className="panel wide-panel">
            <h2>Assignments</h2>

            <div className="assignment-input">
                <input
                    value={title}
                    placeholder="Assignment title..."
                    onChange={(event) => setTitle(event.target.value)}
                />

                <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                />

                <button onClick={addAssignment}>Add</button>
            </div>

            <div className="list">
                {assignments.length === 0 && (
                    <p className="empty">No assignments yet.</p>
                )}

                {assignments.map((assignment) => {
                    const date = new Date(
                        `${assignment.dueDate}T00:00:00`
                    );

                    const overdue =
                        !assignment.completed && date < today;

                    return (
                        <div
                            className={`list-item assignment-item ${
                                overdue ? "overdue" : ""
                            }`}
                            key={assignment.id}
                        >
                            <div>
                                <strong
                                    className={
                                        assignment.completed
                                            ? "completed"
                                            : ""
                                    }
                                >
                                    {assignment.title}
                                </strong>

                                <p>Due: {assignment.dueDate}</p>

                                {overdue && (
                                    <span className="overdue-text">
                                        OVERDUE
                                    </span>
                                )}
                            </div>

                            <div className="button-row">
                                <button
                                    onClick={() =>
                                        toggleAssignment(assignment.id)
                                    }
                                >
                                    {assignment.completed
                                        ? "Undo"
                                        : "Complete"}
                                </button>

                                <button
                                    className="danger-button"
                                    onClick={() =>
                                        deleteAssignment(assignment.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Assignments;