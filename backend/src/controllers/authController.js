const authService = require("../services/authService");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, email, password) are required for registration",
            });
        }

        const userData = await authService.registerUser({ name, email, password });
        res.status(201).json({ success: true, ...userData });
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Registration failed due to server error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Both email and password are required to sign in",
            });
        }

        const userData = await authService.loginUser({ email, password });
        res.status(200).json({ success: true, ...userData });
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Login failed due to server error",
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updatedData = await authService.updateProfile(req.user._id, req.body);
        res.status(200).json({ success: true, ...updatedData });
    } catch (err) {
        const statusCode = err.status || 500;
        res.status(statusCode).json({
            success: false,
            message: err.message || "Profile update failed due to server error",
        });
    }
};

module.exports = { registerUser, loginUser, updateProfile };
