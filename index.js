const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
require("./passport.js");

app.use(passport.initialize());

app.get("/home", function(req, res){
    res.status(200).json({message: "You are in home"});
})

app.get("/login", function(req, res){
    res.send('<a href="http://localhost:3000/auth/google">login with google</a>');
})

app.get("/auth/google", passport.authenticate("google", {scope : ["profile", "email"], prompt: "consent"}))

app.get("/api/v1/google/callback", passport.authenticate("google", {session: false}), (req, res) => {
    const token = jwt.sign({userId : req.user._id}, process.env.JWT_SECRET);
    return res.status(200).json(token);
})

function startServer(){
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => {
        console.log("DB Connected Succesfully");
        app.listen(process.env.PORT, function(){
            console.log("Server is listening on Port " + process.env.PORT);
        })
    })
    .catch(err => {
        console.log("DB Connection failed");
    })
}

startServer();





