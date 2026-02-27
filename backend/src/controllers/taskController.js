const taskService = require("../services/taskService");

const getAllTasks = async (req, res) => {
    try {
        const { page = 1, limit = 4, status } = req.query;
        const paginatedResult = await taskService.getAllTasks(req.user._id, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            status,
        });
        res.status(200).json(paginatedResult);
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Failed to retrieve tasks",
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const singleTask = await taskService.getTaskById(req.params.id, req.user._id);
        res.status(200).json(singleTask);
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Failed to retrieve task details",
        });
    }
};

const createTask = async (req, res) => {
    try {
        const createdTask = await taskService.createTask(req.body, req.user._id);
        res.status(201).json(createdTask);
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Failed to create new task",
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const modifiedTask = await taskService.updateTask(
            req.params.id,
            req.body,
            req.user._id
        );
        res.status(200).json(modifiedTask);
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Failed to update task",
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const removalResult = await taskService.deleteTask(req.params.id, req.user._id);
        res.status(200).json(removalResult);
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Failed to delete task",
        });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
