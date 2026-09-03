import { useState } from "react";

function TodoList({ tasks, setTasks }) {
    const [text, setText] = useState("");

    function addTask() {
        const value = text.trim();

        if (!value) return;

        setTasks([
            ...tasks,
            {
                id: Date.now(),
                text: value,
                completed: false,
            },
        ]);

        setText("");
    }

    function toggleTask(id) {
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    function deleteTask(id) {
        setTasks(tasks.filter((task) => task.id !== id));
    }

    return (
        <section className="panel">
            <h2>To-do List</h2>

            <div className="input-row">
                <input
                    value={text}
                    placeholder="Add a task..."
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") addTask();
                    }}
                />

                <button onClick={addTask}>Add</button>
            </div>

            <div className="list">
                {tasks.length === 0 && (
                    <p className="empty">No tasks yet.</p>
                )}

                {tasks.map((task) => (
                    <div className="list-item" key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                            />

                            <span className={task.completed ? "completed" : ""}>
                                {task.text}
                            </span>
                        </label>

                        <button
                            className="danger-button"
                            onClick={() => deleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TodoList;