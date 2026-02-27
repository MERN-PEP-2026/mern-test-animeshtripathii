const Task = require("../models/Task");

const ITEMS_PER_PAGE = 4;

const getAllTasks = async (userId, { page = 1, limit = ITEMS_PER_PAGE, status }) => {
    const filterQuery = { createdBy: userId };

    if (status && ["pending", "completed"].includes(status)) {
        filterQuery.status = status;
    }

    const totalRecords = await Task.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const skipCount = (page - 1) * limit;

    const taskList = await Task.find(filterQuery)
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limit);

    return {
        tasks: taskList,
        page: Number(page),
        totalPages,
        total: totalRecords,
    };
};

const getTaskById = async (taskId, userId) => {
    const taskRecord = await Task.findById(taskId);

    if (!taskRecord) {
        throw { status: 404, message: "Requested task does not exist" };
    }

    if (taskRecord.createdBy.toString() !== userId.toString()) {
        throw { status: 403, message: "You do not have permission to access this task" };
    }

    return taskRecord;
};

const createTask = async ({ title, description, status, priority, dueDate }, userId) => {
    if (!title || title.trim().length === 0) {
        throw { status: 400, message: "Task title cannot be empty" };
    }

    const newTask = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : "",
        status: status || "pending",
        priority: priority || "low",
        dueDate: dueDate || null,
        createdBy: userId,
    });

    return newTask;
};

const updateTask = async (taskId, fieldsToUpdate, userId) => {
    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
        throw { status: 404, message: "Cannot update - task not found" };
    }

    if (existingTask.createdBy.toString() !== userId.toString()) {
        throw { status: 403, message: "You are not authorized to modify this task" };
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    return updatedTask;
};

const deleteTask = async (taskId, userId) => {
    const targetTask = await Task.findById(taskId);

    if (!targetTask) {
        throw { status: 404, message: "Cannot delete - task not found" };
    }

    if (targetTask.createdBy.toString() !== userId.toString()) {
        throw { status: 403, message: "You are not authorized to remove this task" };
    }

    await Task.findByIdAndDelete(taskId);

    return { success: true, message: "Task has been permanently removed" };
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
