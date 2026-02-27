const authService = require("../services/authService");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Please provide name, email and password" });
        }

        const user = await authService.registerUser({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please provide email and password" });
        }

        const user = await authService.loginUser({ email, password });
        res.status(200).json(user);
    } catch (error) {
        res
            .status(error.status || 500)
            .json({ message: error.message || "Server Error" });
    }
};

module.exports = { registerUser, loginUser };
