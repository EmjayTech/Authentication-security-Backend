//jshint esversion:6
require("dotenv").config();
const express  = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB").then(() => {
    console.log("MongoDB is connected")
}).catch((err) => {
    console.log(err.message)
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save();
    if(newUser){
        res.render("secrets")
    } else{
        console.log("Unable to register the user")
    }
});

app.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({email: username});
    if(foundUser){
        if (foundUser.password === password){
            res.render("secrets")
        } else {
            console.log("Error");
        }
    }
});














const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server is connected at port 3000");
});