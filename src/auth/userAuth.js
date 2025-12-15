const jwt=require("jsonwebtoken")
const express=require("express")
const{User}=require("../models/user")
const cookieParser=require("cookie-parser");
const app=express()
app.use(cookieParser())
const userAuth=async(req,res,next)=>{
    try{
    const authHeader = req.headers.authorization;
    if(!authHeader) throw new Error("Token is not valid")
    const decode=await jwt.verify(authHeader,"ajinkya")
    const{_id}=decode;
    const user=await User.findById(_id)
    if(!user){
        throw new Error("User not found")
    }
    req.user=user;
    next();
    }
    catch(err){
        res.send(err.message)
    }
    

}
module.exports={userAuth}