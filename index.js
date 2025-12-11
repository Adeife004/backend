const express = require('express');
const app = express();
const mongoose = require("mongoose");
const adminRoute = require("./routes/admin.route")
const cors = require('cors');
require("dotenv").config();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use("/", adminRoute);
// app.use("/user", userRoute);

const URI = process.env.MONGO_DB_URI;

mongoose.connect(URI)
.then(()=>{
    console.log("Database connected");
})
.catch((err)=>{
    console.log("Error try again olodo")
    console.log(err);
})

// START SERVER 
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

// dotenv
