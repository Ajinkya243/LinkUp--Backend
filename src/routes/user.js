const express=require("express");
const { userAuth } = require("../auth/userAuth");
const { ConnectionRequest } = require("../models/connectionRequest");
const {User} =require("../models/user");
const userRouter=express.Router();

//get allpending connection request
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedUser=req.user;
        const connectionRequest=await ConnectionRequest.find({toUserId:loggedUser._id,status:"interested"}).populate("fromUserId","firstName lastName photo age gender about skills")
        res.json({message:"Data fetched successfully",connectionRequest})
    }
    catch(error){
        res.status(400).send("Error: "+error.message)
    }
})

//get connected user
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedUser=req.user;
        const connectionRequest=await ConnectionRequest.find({$or:[{toUserId:loggedUser._id,status:"accepted"},{fromUserId:loggedUser._id,status:"accepted"}]}).populate("fromUserId","firstName lastName age gender").populate("toUserId","firstName lastName age gender")
        const data=connectionRequest.map(el=>{
                if(el.fromUserId._id.toString() === loggedUser._id.toString()){
                    return el.toUserId
                }
                else{
                    return el.fromUserId
                }
        })
        res.json({data})
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedUser=req.user;
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;

        const connectionRequest=await ConnectionRequest.find({$or:[
            {fromUserId:loggedUser._id},{toUserId:loggedUser._id}
        ]}).select("fromUserId toUserId");
        const hideUsersFromFeed=new Set();
        connectionRequest.map(el=>{
            hideUsersFromFeed.add(el.fromUserId.toString());
            hideUsersFromFeed.add(el.toUserId.toString());
        })

        const users=await User.find({$and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedUser._id}}]}).select("firstName lastName age gender photo").skip(skip).limit(limit);
        res.send(users)
    }
    catch(error){

    }
})

module.exports={userRouter}