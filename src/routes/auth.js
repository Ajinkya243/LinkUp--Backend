const express=require("express")
const authRouter=express.Router()
const{validateSignup}=require("../utils/validateSignup")
const jwt=require("jsonwebtoken");
const {User}=require("../models/user")
const bcrypt=require("bcrypt")

authRouter.post("/signup",async(req,res)=>{
    try{
    validateSignup(req)
    const{password}=req.body;
    const bcryptPassword=await bcrypt.hash(password,10)
    const userObj=new User({...req.body,password:bcryptPassword})
    await userObj.save()
    res.send(userObj)
    }
    catch(error){
        res.send("Error:"+error.message)
    }
    
})



authRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const isUser=await User.findOne({email});
    if(!isUser){
       return res.status(404).send("User email not found")
    }
    const bcryptPass=await bcrypt.compare(password,isUser.password)
    if(bcryptPass){
        const token=await jwt.sign({_id:isUser._id},"ajinkya",{expiresIn:"24h"})
        console.log(token)
        res.cookie("token",token)
        res.send("User login successful")
    }
    else{
        throw new Error("Password is not valid")
    }
})

module.exports={authRouter}