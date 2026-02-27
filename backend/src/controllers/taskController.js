const taskService = require("../services/taskService");

const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks(req.user._id);
        res.status(200).json(tasks);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user._id);
        res.status(200).json(task);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.user._id);
        res.status(201).json(task);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user._id
        );
        res.status(200).json(task);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user._id);
        res.status(200).json(result);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
