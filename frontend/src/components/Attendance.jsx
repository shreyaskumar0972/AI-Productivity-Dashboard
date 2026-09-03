function Attendance({ attendance, setAttendance }) {
    const total = attendance.present + attendance.absent;

    const percentage =
        total === 0
            ? 0
            : (attendance.present / total) * 100;

    function resetAttendance() {
        if (!window.confirm("Reset attendance data?")) return;

        setAttendance({
            present: 0,
            absent: 0,
        });
    }

    return (
        <section className="panel">
            <h2>Attendance Tracker</h2>

            <div className="attendance-large">
                {percentage.toFixed(1)}%
            </div>

            <p>
                Present: {attendance.present} | Absent: {attendance.absent}
            </p>

            <div className="attendance-controls">
                <button
                    onClick={() =>
                        setAttendance({
                            ...attendance,
                            present: attendance.present + 1,
                        })
                    }
                >
                    Present
                </button>

                <button
                    onClick={() =>
                        setAttendance({
                            ...attendance,
                            absent: attendance.absent + 1,
                        })
                    }
                >
                    Absent
                </button>

                <button onClick={resetAttendance}>Reset</button>
            </div>
        </section>
    );
}

export default Attendance;