const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        },
        required:true
    }
},{timestamps:true})

connectionRequestSchema.pre("save",function(next){  //this run before save
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send request to self")
    }
    next();
})

connectionRequestSchema.index({fromUserId:1,toUserId:1}) //indexes for fast query search
const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports={ConnectionRequest}