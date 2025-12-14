const express=require("express")
const app=express();
const{authRouter}=require("./routes/auth")
const{profileRouter}=require("./routes/profile")
const{requestRouter}=require("./routes/request")
const{userRouter}=require("./routes/user")
const cors=require('cors');
app.use(express.json())
app.use(cors());
const cookieParser=require("cookie-parser")
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Welcome to LinkUp Backend");
})

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



const {connectDB}=require("./config/database")
connectDB().then(()=>console.log("Database connected")).then(()=>app.listen(5000,()=>{
    console.log("Server running on 5000")
}))