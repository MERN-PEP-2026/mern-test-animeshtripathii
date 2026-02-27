const jwt = require("jsonwebtoken");
const User = require("../models/User");

const TOKEN_EXPIRY = "30d";

const createAuthToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_Secret_Key, {
        expiresIn: TOKEN_EXPIRY,
    });
};

const registerUser = async ({ name, email, password }) => {
    const existingAccount = await User.findOne({ email: email.toLowerCase() });
    if (existingAccount) {
        throw { status: 400, message: "An account with this email already exists" };
    }

    const newUser = await User.create({ name, email, password });

    if (!newUser) {
        throw { status: 400, message: "Unable to create account - please check your information" };
    }

    return {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: createAuthToken(newUser._id),
    };
};

const loginUser = async ({ email, password }) => {
    const foundUser = await User.findOne({ email: email.toLowerCase() });

    if (!foundUser) {
        throw { status: 401, message: "No account found with this email address" };
    }

    const isPasswordValid = await foundUser.matchPassword(password);
    if (!isPasswordValid) {
        throw { status: 401, message: "Incorrect password - please try again" };
    }

    return {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        token: createAuthToken(foundUser._id),
    };
};

const updateProfile = async (userId, { name, email, password }) => {
    const currentUser = await User.findById(userId);

    if (!currentUser) {
        throw { status: 404, message: "User account not found" };
    }

    if (email && email.toLowerCase() !== currentUser.email) {
        const emailTaken = await User.findOne({ email: email.toLowerCase() });
        if (emailTaken) {
            throw { status: 400, message: "This email is already associated with another account" };
        }
    }

    if (name) currentUser.name = name;
    if (email) currentUser.email = email.toLowerCase();
    if (password) currentUser.password = password;

    const savedUser = await currentUser.save();

    return {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        token: createAuthToken(savedUser._id),
    };
};

module.exports = { registerUser, loginUser, updateProfile };
