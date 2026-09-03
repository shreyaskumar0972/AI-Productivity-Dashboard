const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({
            createdAt: -1,
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks",
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const task = await Task.create({
            text: req.body.text,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create task",
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                completed: req.body.completed,
            },
            {
                new: true,
            }
        );

        res.json(task);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update task",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);

        res.json({
            message: "Task deleted",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete task",
        });
    }
});

module.exports = router;