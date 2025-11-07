const mongoose=require("mongoose")
require("dotenv").config()

const connectDB=async()=>{
    await mongoose.connect(process.env.mongoUrl)
}

module.exports={connectDB}
//connectDB().then(()=>console.log("Database connected")).catch(err=>console.log(err.message))