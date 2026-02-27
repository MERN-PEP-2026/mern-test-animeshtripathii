const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

router
    .route("/")
    .get(protect, taskController.getAllTasks)
    .post(protect, taskController.createTask);

router
    .route("/:id")
    .get(protect, taskController.getTaskById)
    .put(protect, taskController.updateTask)
    .delete(protect, taskController.deleteTask);

module.exports = router;
