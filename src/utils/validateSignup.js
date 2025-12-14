const validator=require("validator")
const validateSignup=(req)=>{
    const{firstName,lastName,email,password}=req.body;
    if(!firstName||!lastName){
        throw new Error("Name is not valid")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }
}
module.exports={validateSignup}