//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


// mongoose setup
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

app.get("/see",(req,res) => {
    res.render("secrets");
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/",(req,res) => {
    res.render("home");
});

app.get("/register",(req,res) => {
    res.render("register");
});

app.get("/login",(req,res) => {
    res.render("login");
});



app.post("/register",async(req,res) => {
    try {
        const newUser = await new User({
            email:req.body.username,
            password:req.body.password
        });
        newUser.save().then(() => {
            res.render("secrets");
        });
    } catch (err) {
        console.log(err);
    }
});


app.post("/login",async(req,res) => {
    const username = req.body.username;
    const password  = req.body.password;
    try {
        const foundUser = await User.findOne({email:username});
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    } catch (err) {
        console.log(err);
    }
});



app.listen(3000,() => {
    console.log("listening on port 3000");
});