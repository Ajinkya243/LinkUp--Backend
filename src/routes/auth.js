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
    res.json({message:"User login successfully",userObj})
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
        res.cookie("token",token)
        res.json({message:"User login successful",user:isUser,token});
    }
    else{
        throw new Error("Password is not valid")
    }
})

authRouter.post("/logout",async(req,res)=>{
   res.cookie("token",null,{expires:new Date(Date.now())})
   res.send()
})

module.exports={authRouter}