const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const passport = require("passport");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
require("./passport.js")
app.use(passport.initialize());


app.get("/login", function(req, res){
    res.send('<a href="/auth/google">login with google</a>');
})

app.get("/auth/google", 
    passport.authenticate("google", {scope: ["profile", "email"], prompt: "consent"})
);

app.get("/api/v1/google/callback", passport.authenticate("google", {session: false}),
 async function(req, res) {
    console.log(req.user);
    const token = await jwt.sign({userId: req.user.id}, process.env.JWT_SECRET);
    return res.status(200).json({token});
})


function startServer(){
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => {
        app.listen(process.env.PORT, function(){
            console.log("Server is listening on Port " + process.env.PORT)
        })
    })
    .catch(err => {
        console.log("DB connection failed");
    })
}

startServer();



