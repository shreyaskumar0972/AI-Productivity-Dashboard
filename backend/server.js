const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AI Productivity Dashboard API is running",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Backend is healthy",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});