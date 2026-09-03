const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const GOAL = 240;

function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) return `${remaining}m`;
    if (remaining === 0) return `${hours}h`;

    return `${hours}h ${remaining}m`;
}

function StudyProgress({ studyData }) {
    return (
        <section className="panel">
            <h2>Weekly Study Progress</h2>

            <div className="study-chart">
                {DAY_LABELS.map((day, index) => {
                    const minutes = studyData[index] || 0;
                    const height = Math.min((minutes / GOAL) * 100, 100);

                    return (
                        <div className="study-column" key={index}>
                            <span className="study-value">
                                {formatMinutes(minutes)}
                            </span>

                            <div className="bar-track">
                                <div
                                    className="study-bar"
                                    style={{ height: `${height}%` }}
                                />
                            </div>

                            <span>{day}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}


export default StudyProgress;