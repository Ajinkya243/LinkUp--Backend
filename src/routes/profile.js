const express=require("express")
const profileRouter=express.Router()
const{userAuth}=require("../auth/userAuth")

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        console.log(user)
        res.send(user)
    }
    catch(error){
        throw new Error("Something went wrong")
    }
})

module.exports={profileRouter}