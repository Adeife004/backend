const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ----- Register user -----
const addUser = (req, res) => {
    let form = new userModel(req.body);

    form.save()
        .then(() => {
            console.log("User Saved Successfully");
            res.send({ status: true, message: "User Saved Successfully" });
        })
        .catch((err) => {
            console.log("Registration Error:", err);
            res.send({ status: false, message: "Error saving user" });
        });
};

// ----- Authenticate user and issue JWT -----
const authenticateUser = (req, res) => {
    console.log("Login Attempt:", req.body);

    const { email, password } = req.body;

    userModel.findOne({ email })
        .then((user) => {

            if (!user) {
                return res.send({ status: false, message: "Invalid Credentials" });
            }

            user.validatePassword(password, (err, isMatch) => {

                if (err) {
                    console.log("Password validation error:", err);
                    return res.send({ status: false, message: "Server Error" });
                }

                if (!isMatch) {
                    return res.send({ status: false, message: "Invalid Credentials" });
                }

                // Create JWT token
                let token = jwt.sign(
                    { id: user._id, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "5s" }
                );

                console.log("JWT Token:", token);

                const userData = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    created_date: user.created_date,
                };

                return res.send({
                    status: true,
                    message: "User Authenticated",
                    token,
                    user: userData
                });
            });
        })
        .catch((error) => {
            console.log("Login Error:", error);
            return res.send({ status: false, message: "Server Error" });
        });
};

// ----- Protected Dashboard endpoint -----
const getDashboard = (req, res) => {
    // Get token from headers: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: false, message: "Invalid token" });
        }

        // Optionally fetch user info
        userModel.findById(decoded.id)
            .then(user => {
                res.json({
                    status: true,
                    message: "Dashboard data fetched successfully",
                    user: {
                        id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        created_date: user.created_date
                    }
                });
            })
            .catch(err => res.status(500).json({ status: false, message: "Server error" }));
    });
};

module.exports = {
    addUser,
    authenticateUser,
    getDashboard
};
