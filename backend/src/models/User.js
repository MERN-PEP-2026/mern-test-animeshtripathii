const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your full name"],
            trim: true,
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email address is mandatory"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email format"],
        },
        password: {
            type: String,
            required: [true, "Password field cannot be empty"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const generatedSalt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, generatedSalt);
    next();
});

userSchema.methods.matchPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
