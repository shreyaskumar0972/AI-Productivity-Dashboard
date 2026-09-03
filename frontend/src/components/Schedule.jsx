import { useState } from "react";

function Schedule({ schedule, setSchedule }) {
    const [time, setTime] = useState("");
    const [title, setTitle] = useState("");

    function addEvent() {
        if (!time || !title.trim()) return;

        const newSchedule = [
            ...schedule,
            {
                id: Date.now(),
                time,
                title: title.trim(),
            },
        ].sort((a, b) => a.time.localeCompare(b.time));

        setSchedule(newSchedule);

        setTime("");
        setTitle("");
    }

    function deleteEvent(id) {
        setSchedule(schedule.filter((event) => event.id !== id));
    }

    return (
        <section className="panel">
            <h2>Today's Schedule</h2>

            <div className="schedule-input">
                <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                />

                <input
                    value={title}
                    placeholder="Event title..."
                    onChange={(event) => setTitle(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") addEvent();
                    }}
                />

                <button onClick={addEvent}>Add</button>
            </div>

            <div className="list">
                {schedule.length === 0 && (
                    <p className="empty">No events scheduled.</p>
                )}

                {schedule.map((event) => (
                    <div className="list-item" key={event.id}>
                        <div>
                            <strong>{event.time}</strong>
                            <span className="schedule-title">{event.title}</span>
                        </div>

                        <button
                            className="danger-button"
                            onClick={() => deleteEvent(event.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Schedule;