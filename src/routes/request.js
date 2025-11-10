const express=require("express")
const requestRouter=express.Router()
const{userAuth}=require("../auth/userAuth")
const{ConnectionRequest}=require("../models/connectionRequest")
const { User } = require("../models/user")


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const status=req.params.status;
        const toUserId=req.params.toUserId;
        const allowedStatus=["ignored","interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:`Invalid status type ${status}`})
        }

        //check for existing request
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection request already exist"})
        }

        //check for touser
        const toUser= await User.findById(toUserId)
        if(!toUser) return res.status(404).json({message:"User not found!"})

            //user sent req to self
        if(fromUserId===toUserId) return res.status(400).json({message:"Cant send request"})    


        const connectionRequest=new ConnectionRequest({fromUserId,toUserId,status});
        await connectionRequest.save();
        res.json({message:"Connection request send successfully",data:connectionRequest})
    }
    catch(error){
        res.status(400).send("Error: "+error.message);
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedUser=req.user;
        const{status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"]

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status is not allowed"})
        }
        const connectionRequest=await ConnectionRequest.findOne({_id:requestId,toUserId:loggedUser._id,status:"interested"});
        if(!connectionRequest){
            return res.status(404).json({message:"Request not found"})
        }
        connectionRequest.status=status
        const data=await connectionRequest.save()
        res.json({message:"Connection request "+status,data})
    }
    catch(error){
        res.status(400).send("Error: "+error.message)
    }
})

module.exports={requestRouter}

