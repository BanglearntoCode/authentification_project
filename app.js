//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require('ejs')
const app = express()
// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const encrypt = require("mongoose-encryption")


// setup the app
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set("view engine", "ejs")

console.log(process.env.API_KEY)
// create the schema for users
const userSchema = mongoose.Schema({
    email: String,
    password: String
})
// encrypt the user email and password
var secret = process.env.SECRET

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)


// functions for app.request
async function checkLoginUser(email_input, password_input){
    const foundUser = await User.findOne({email: email_input});
    if (foundUser && foundUser.password === password_input){
        return true;
    } else {
        console.log("Wrong email or password");
        return false;
    }
}









app.get("/", function (req, res){
    res.render("home")
})
app.get("/login", function(req, res){
    res.render("login")
})
app.get("/register", function(req, res){
    res.render("register")
})




app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
    .then(savedUser => {
        savedUser === newUser;
        console.log("Successfully add new user information")
    res.render("secrets")
      })
      .catch(error => {
        console.error("Error saving user:", error);
        res.render("error");
    });
})
app.post("/login", async function(req, res){
    const username = req.body.username
    const password = req.body.password
    if (await checkLoginUser(username, password)) {
        res.render("secrets")
    } else {
        res.send("You entered wrong email or password")
    }
})




app.listen(3000, function(){
    console.log("Server is running at port 3000")
})