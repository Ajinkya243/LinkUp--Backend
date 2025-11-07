const express=require("express")
const requestRouter=express.Router()
const{userAuth}=require("../auth/userAuth")


requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        console.log("Sending connection request")
        res.send(user.firstName+" send connection request")
    }
    catch(error){

    }
})

module.exports={requestRouter}

