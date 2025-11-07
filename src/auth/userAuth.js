const jwt=require("jsonwebtoken")
const{User}=require("../models/user")
const userAuth=async(req,res,next)=>{
    try{
        const cookies=req.cookies;
    if(!cookies.token) throw new Error("Token is not valid")
    const decode=await jwt.verify(cookies.token,"ajinkya")
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