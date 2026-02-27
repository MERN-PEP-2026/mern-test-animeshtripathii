const Task = require("../models/Task");

const getAllTasks = async (userId) => {
    return await Task.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const getTaskById = async (taskId, userId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw { status: 404, message: "Task not found" };
    }

    if (task.createdBy.toString() !== userId.toString()) {
        throw { status: 401, message: "Not authorized" };
    }

    return task;
};

const createTask = async ({ title, description, status }, userId) => {
    if (!title) {
        throw { status: 400, message: "Title is required" };
    }

    return await Task.create({
        title,
        description,
        status,
        createdBy: userId,
    });
};

const updateTask = async (taskId, updateData, userId) => {
    let task = await Task.findById(taskId);

    if (!task) {
        throw { status: 404, message: "Task not found" };
    }

    if (task.createdBy.toString() !== userId.toString()) {
        throw { status: 401, message: "Not authorized" };
    }

    task = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
        runValidators: true,
    });

    return task;
};

const deleteTask = async (taskId, userId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw { status: 404, message: "Task not found" };
    }

    if (task.createdBy.toString() !== userId.toString()) {
        throw { status: 401, message: "Not authorized" };
    }

    await Task.findByIdAndDelete(taskId);

    return { message: "Task deleted successfully" };
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
