const express=require("express")
const app=express();

// 17 routing

// app.use("/user",async(req,res)=>{
//     res.send("user use server")
// })
// app.get("/a{b}c",(req,res)=>{ // /abc and /ac also work
//     res.send("optional b in url")
// })
// app.get(/^\/ab+c$/,(req,res)=>{ //abc abbbbbbc ab++99timesc
//     res.send("a and c should be at start and end")
// })
// app.get("/user",(req,res)=>{
//     const{name}=req.query
//     console.log(req.query,name)
//     res.send("User get api")
// })
// app.get("/user/:id",(req,res)=>{
//     const {id}=req.params
// console.log(id)
// res.send(`${id} in url`)
// })
// app.post("/user",(req,res)=>{
//     res.send("User post api")
// })
// app.use("/test",async(req,res)=>{
//     res.send("test server")
// })

// app.use("/test/123",async(req,res)=>{
//     res.send("test server 123")
// })

// app.use("/",async(req,res)=>{
//     res.send("second")
// })

// app.use("/",async(req,res)=>{
//     res.send("first")
// })


//18 middleware
//1
// app.use("/user",(req,res)=>{ //this only load
//     console.log("response 1 send") 
// },(req,res)=>{
//     console.log("response 2 send")
// })

//2
// app.use("/user",(req,res)=>{ 
//     res.send("Response 1") //get this
// },(req,res)=>{
//     res.send("Response 2")
// })

// app.use("/user",(req,res,next)=>{ 
//     next()
// },(req,res)=>{
//     res.send("Response 2")  //get this response
//     console.log("response 2")
// })

// app.use("/user",(req,res,next)=>{ 
//     res.send("response 1") //get this in postman
//     next()
// },(req,res)=>{
//     res.send("Response 2") //get error here in terminal
//     console.log("response 2")
// })

// app.use("/user",(req,res,next)=>{ 
//     next() //first execute 2nd 
//     res.send("response 1") //get error here
    
// },(req,res)=>{
//     res.send("Response 2") 
//     console.log("response 2") //postman output
// })


// app.use("/user",(req,res,next)=>{ 
//     console.log("response 1")
//     next() //first execute 2nd 
// },(req,res,next)=>{
//     console.log("response 2") 
//     next() //error here because no next handler
// })

// app.use("/user",(req,res,next)=>{
//     console.log("response 1")
//     next()
// })
// app.use("/user",(req,res)=>{
//     console.log("response 2")
//     res.send("2nd Response") //postman output
// })



// app.use("/user",(req,res,next)=>{
//     console.log("response 1")
//     next()
// })
// app.use("/user1",(req,res)=>{ //here next through error because route handler is different 
//     console.log("response 2")
//     res.send("2nd Response")
// })



// app.use("/",(req,res,next)=>{
//     next()
// })
// app.get("/user",(req,res)=>{ 
//     console.log("response 2")
//     res.send("2nd Response post")
// })
// app.post("/user",(req,res)=>{
//     res.send("User post api")
// })


//auth middleware with app.use

// app.use("/admin",(req,res,next)=>{
//     const token="ajinkya"
//     if(!token) return res.send("Not allowed")
//         next();
// })

// app.get("/admin/getData",(req,res)=>{
//     res.send({
//         "first":"Ajinkya",
//         "last":"Gund"
//     })
// })
// app.delete("/admin/delete",(req,res)=>{
//     res.send({
//         "first":"Ajinkya"
//     })
// })


// app.get("/user",(req,res,next)=>{
//     console.log("1st user api")
//     next()
// })
// app.get("/user",(req,res)=>{
//     console.log("2nd user api")
//     res.send("User")
// })


//middleware with function

// app.use("/admin",(req,res,next)=>{
//     console.log("Admin middleware")
//     next()
// })
// app.get("/admin",(req,res)=>{
//     console.log("Admin api")
//     res.send("user")
// })


// const userAuth=(req,res,next)=>{
//     const token="ajinkya"
//     if(!token) return res.status(404).json({message:"not authorize"})
//     next()    
// }
// app.get("/user",userAuth,(req,res)=>{
//     res.send("Welcome back user")
// })


//error handling
// app.get("/userData",(req,res)=>{
//     throw new Error("Something went wrong")
// })
// app.use("/",(err,req,res,next)=>{
//     if(err)return res.status(500).send(err.message)
// })

const {User}=require("./models/user")
const{validateSignup}=require("./utils/validateSignup")
const bcrypt=require("bcrypt")
app.use(express.json())
app.post("/user",async(req,res)=>{
    try{
    validateSignup(req)
    const{password}=req.body;
    const bcryptPassword=await bcrypt.hash(password,10)
    const userObj=new User({...req.body,password:bcryptPassword})
    await userObj.save()
    res.send(userObj)
    }
    catch(error){
        res.send("Error:"+error.message)
    }
    
})

app.patch("/user/:id",async(req,res)=>{
    console.log(req.body);
    //if email send then dont update
    //aksay logic
    const allowed_updates=["firstName","lastName","age","password","skills","gender"]
    const isAllowed=Object.keys(req.body).every(el=>allowed_updates.includes(el))
    if(isAllowed){
        try{
        const {id}=req.params;
    const user=await User.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})
    res.send(user)
    }
    catch(error){
        res.send(error.message)
    }
    }
    else res.send("email update not allowed")


    //my logic
    const{email}=req.body
    if(email){
        res.send("Email update not allowed")
    }
    ////remaining code
    
})

const jwt=require("jsonwebtoken");

app.post("/user/login",async(req,res)=>{
    const{email,password}=req.body;
    const isUser=await User.findOne({email});
    if(!isUser){
       return res.status(404).send("User email not found")
    }
    const bcryptPass=await bcrypt.compare(password,isUser.password)
    if(bcryptPass){
        const token=await jwt.sign({_id:isUser._id},"ajinkya",{expiresIn:"24h"})
        console.log(token)
        res.cookie("token",token)
        res.send("User login successful")
    }
    else{
        throw new Error("Password is not valid")
    }
})
const cookieParser=require("cookie-parser");
app.use(cookieParser())
const{userAuth}=require("./auth/userAuth")
// app.get("/profile",async(req,res)=>{
//     try{
//         const cookies=req.cookies
//         if(!cookies.token){
//             throw new Error("Invalid token")
//         }
//         const decode=await jwt.verify(cookies.token,"ajinkya")
//         console.log(decode)
//         const user=await User.findById(decode._id);
//         res.send(user);
//     }
//     catch(error){
//         throw new Error("Something went wrong")
//     }
// })

//get api with middeware
app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        console.log(user)
        res.send(user)
    }
    catch(error){
        throw new Error("Something went wrong")
    }
})


// app.post("/user/:id",async(req,res)=>{
//     const user=await User.findByIdAndUpdate(req.params.id,{lastName:"Gund"},{new:true});
//     res.send(user)
// })



// app.get("/user",(req,res)=>{
//     throw new Error("Something went wrong")
// })
// app.use("/user",(err,req,res,next)=>{
//     res.send(err.message)
// })

const {connectDB}=require("./config/database")
connectDB().then(()=>console.log("Database connected")).then(()=>app.listen(5000,()=>{
    console.log("Server running on 5000")
}))