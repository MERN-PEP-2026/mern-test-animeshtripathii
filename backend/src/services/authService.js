const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_Secret_Key, {
        expiresIn: "30d",
    });
};

const registerUser = async ({ name, email, password }) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw { status: 400, message: "User already exists" };
    }

    const user = await User.create({ name, email, password });

    if (!user) {
        throw { status: 400, message: "Invalid user data" };
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        };
    }

    throw { status: 401, message: "Invalid email or password" };
};

module.exports = { registerUser, loginUser };
