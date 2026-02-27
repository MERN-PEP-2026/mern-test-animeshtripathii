const mongoose = require("mongoose");

const TASK_STATUSES = ["pending", "completed"];
const PRIORITY_LEVELS = ["low", "medium", "high", "critical"];

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is mandatory"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: {
                values: TASK_STATUSES,
                message: "{VALUE} is not a valid status",
            },
            default: "pending",
        },
        priority: {
            type: String,
            enum: {
                values: PRIORITY_LEVELS,
                message: "{VALUE} is not a valid priority level",
            },
            default: "low",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Task must be associated with a user"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

taskSchema.index({ createdBy: 1, status: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
