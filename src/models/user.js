const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        vallidate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid.")
            }
        }
    },
    age:{
        type:Number,
        required:true,
        min:18,
        max:50
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"Demo pic"
    },
    skills:{
        type:[String]
    },
    gender:{
        type:String,
        validate(value){ //validate function works when we do new post
            if(!['male','female','other'].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    }
},{timestamps:true})

userSchema.methods.getJwt=async function(){
    const token=await jwt.sign({_id:this._id},"ajinkya",{expiresIn:"24h"});
    return token;
}

const User=mongoose.model("User",userSchema)
module.exports={User}