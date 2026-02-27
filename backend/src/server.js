const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const initializeDatabase = require("./config/db");

dotenv.config({ path: path.join(__dirname, "../.env") });

initializeDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TaskMaster API - Server is active",
        version: "1.0.0",
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

const SERVER_PORT = process.env.PORT || 5000;

app.listen(SERVER_PORT, () => {
    console.log(`TaskMaster server listening on port ${SERVER_PORT}`);
});
