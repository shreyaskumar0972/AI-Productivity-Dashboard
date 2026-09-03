function StatCard({ title, value, subtitle, className = "" }) {
    return (
        <div className={`stat-card ${className}`}>
            <h3>{title}</h3>
            <h2>{value}</h2>
            {subtitle && <p>{subtitle}</p>}
        </div>
    );
}

export default StatCard;