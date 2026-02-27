const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            success: false,
            message: "Access denied - authentication token is missing",
        });
    }

    try {
        const extractedToken = authHeader.split(" ")[1];
        const decodedPayload = jwt.verify(extractedToken, process.env.JWT_Secret_Key);
        const authenticatedUser = await User.findById(decodedPayload.id).select("-password");

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "Access denied - user account not found",
            });
        }

        req.user = authenticatedUser;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Access denied - token verification failed",
        });
    }
};

module.exports = { protect };
