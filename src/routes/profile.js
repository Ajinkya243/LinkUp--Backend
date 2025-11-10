const express=require("express")
const profileRouter=express.Router()
const{userAuth}=require("../auth/userAuth")
const{validateEditProfileData}=require("../utils/validateEditProfileData")
const {User}=require("../models/user")



profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        console.log(user)
        res.send(user)
    }
    catch(error){
        throw new Error("Something went wrong")
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const isAllowed=validateEditProfileData(req)
        if(!isAllowed){
            throw new Error("Invalid edit request")
        }
        const loggedUser=req.user;
        const user=await User.findByIdAndUpdate(loggedUser._id,req.body,{new:true})
        res.send(user)
        //console.log(loggedUser)
    }
    catch(error){
        res.status(400).send("Error occur"+error.message)
    }

})

module.exports={profileRouter}