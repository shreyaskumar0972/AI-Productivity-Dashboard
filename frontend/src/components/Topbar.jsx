function Topbar({
    search,
    setSearch,
    lightMode,
    setLightMode,
    notificationCount,
    onNotificationClick,
}) {
    return (
        <header className="topbar">
            <div className="search">
                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search tasks or schedule..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="topbar-actions">
                <button
                    className="icon-button notification-button"
                    onClick={onNotificationClick}
                >
                    🔔

                    {notificationCount > 0 && (
                        <span className="notification-badge">
                            {notificationCount}
                        </span>
                    )}
                </button>

                <button
                    className="icon-button"
                    onClick={() => setLightMode(!lightMode)}
                >
                    {lightMode ? "☀️" : "🌙"}
                </button>

                <img
                    className="avatar"
                    src="https://i.pravatar.cc/48?img=12"
                    alt="Profile"
                />
            </div>
        </header>
    );
}

export default Topbar;