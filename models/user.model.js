const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// user schema
const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_date: { type: Date, default: Date.now }
});

// hash password before saving
let saltRound = 10;
UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, saltRound, (err, hashedPassword) => {
        if (err) {
            console.log("Password could not be hashed", err);
            return next(err);
        }

        user.password = hashedPassword;
        next();
    });
});

// method to validate password
UserSchema.methods.validatePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, result) => {
        if (err) return callback(err, false);
        callback(null, result);
    });
};

const UserModel = mongoose.model("User_Data", UserSchema, "User_Data");

module.exports = UserModel;
