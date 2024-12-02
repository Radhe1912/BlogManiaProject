const { Router } = require('express');
const User = require('../models/user');
const { createTokenForUser } = require('../services/authentication');

const router = Router();

router.get("/signin", (req,res)=>{
    res.render("signin")
});

router.get("/signup", (req,res)=>{
    res.render("signup")
});

router.get("/logout", (req,res)=>{
    res.clearCookie("token").redirect("/");
})

router.post("/signin",async (req,res)=>{
    const { email, password } = req.body;

    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        res.cookie('token',token).redirect("/");
    }
    catch(err){
        res.render("signin",{ error: err })
    }
});

router.post("/signup", async(req,res)=>{
    const { fullName, email, password } = req.body;
    try {
        const newUser = await User.create({
            fullName,
            email,
            password
        });
        const token = createTokenForUser(newUser);
        res.cookie('token', token).redirect("/");
    } catch (error) {
        console.error("Signup Error:", error);
        res.render("signup", { error: "Error creating user" });
    }
});

module.exports = router;