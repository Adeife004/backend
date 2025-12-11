const express = require('express');
const router = express.Router();
const { addProduct, fetchProduct, deleteProduct, editProduct, updateProduct, productDisplay } = require('../controllers/product.controller');
const { addUser, authenticateUser, getDashboard } = require('../controllers/user.controller');
const customers = [];
const endpoint = require("../utils/endpoint");

// ----- Basic API -----
router.get('/', (req, res) => {
    console.log("Backend is working");
    res.json(endpoint);
});

router.get('/about', (req, res) => {
    console.log("This is my about page");
    res.send('<h1>Hello, Jasmine! Make sure you overcome backend 💪</h1>');
});

// Make sure endpoint2 exists if used
// router.get('/music', (req, res) => {
//     console.log("This is my music page");
//     res.json(endpoint2 || []);
// });

router.get('/welcome', (req, res) => {
    console.log("This is my welcome page", __dirname);
    res.sendFile(__dirname + '/index.html');
});

router.get('/services', (req, res) => {
    console.log("This is my services page");
    res.sendFile(__dirname + '/services.html');
});

// ----- EJS-rendered pages -----
router.get('/signin', (req, res) => res.render("signin"));
router.get('/signup', (req, res) => res.render("signup"));
router.get('/home', (req, res) => res.render("index", { endpoint }));
router.get("/dashboard", (req, res) => res.render("dashboard", { customers }));

// ----- Dashboard management -----
router.post("/delete/:index", (req, res) => {
    const removeUser = req.params.index;
    customers.splice(removeUser, 1);
    res.redirect("/dashboard");
});

router.post("/update/:index", (req, res) => {
    const updateUser = req.params.index;
    customers[updateUser] = req.body;
    res.redirect("/dashboard");
});

// ----- Product routes -----
router.get("/add-product", productDisplay);
router.post("/product", addProduct);
router.get("/allproducts", fetchProduct);
router.get("/deleteproduct/:id", deleteProduct);
router.get("/editproduct/:id", editProduct);
router.post("/updateproduct/:id", updateProduct);

// ----- User routes -----
router.post("/register", addUser);
router.post("/signin", authenticateUser);

// ----- User dashboard API -----
router.get("/user-dashboard", getDashboard);

module.exports = router;
