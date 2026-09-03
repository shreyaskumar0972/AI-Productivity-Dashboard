function Notifications({
    notifications,
    open,
    onClose,
}) {
    if (!open) return null;

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>Notifications</h3>
                <button onClick={onClose}>Close</button>
            </div>

            {notifications.length === 0 ? (
                <p className="empty">🎉 You're all caught up!</p>
            ) : (
                notifications.map((notification, index) => (
                    <div className="notification-item" key={index}>
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Notifications;