function Sidebar() {
    const items = [
        ["⌂", "Dashboard"],
        ["▣", "Assignments"],
        ["✓", "Attendance"],
        ["▤", "Notes"],
        ["◷", "Pomodoro"],
    ];

    return (
        <aside className="sidebar">
            <div className="logo">
                <span>🎓</span>
                <strong>StudentDash</strong>
            </div>

            <nav>
                {items.map(([icon, label], index) => (
                    <button
                        className={`nav-item ${index === 0 ? "active" : ""}`}
                        key={label}
                    >
                        <span>{icon}</span>
                        <span className="nav-label">{label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;