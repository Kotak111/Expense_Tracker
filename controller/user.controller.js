const { compare } = require("../middleware/compare");
const { hash } = require("../middleware/hashpassword");
const User = require("../model/user.model");
const { generateToken } = require("../services/GenrateToken");

exports.create = async(req,res)=>{
    try {
        const { username,email,password } = req.body;
        console.log(req.body);
        
            if (!email || !password || !username) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                })
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email"
                })
            }
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "password must be at letest 6 characters"
                })
            }
            const existingUserByEmail = await User.findOne({ email: email })
            if (existingUserByEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                })
            }
            const existingUserByUsername = await User.findOne({ username: username })
            if (existingUserByUsername) {
                return res.status(400).json({
                    success: false,
                    message: "username already exists"
                })
            }
            const hashpassword =await hash(password)
           const user=await User.create({
           username,
           email,
           password:hashpassword
           })
           if(user){
            res.status(200).json({
                success:true,
                message:"User Registration..."
            })
           }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
        
    }
}
exports.login =async(req,res)=>{
   try {
     const {email,password}=req.body;
     const user= await User.findOne({email:email})
     if(!user){
     res.status(404).json({
         success:false,
         message:"User Is Not register"
     })
    }
 
     const Ispassword= await compare(password,user.password)
     if(!Ispassword){
         res.status(404).json({
             success:false,
             message:"Invalid credential"
         })
     }
      generateToken(user._id,res)
      res.status(200).json({
         success:true,
         user:{
             ...user._doc,
             password:""
         }
     })
   } catch (error) {
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Internal Server error"
    })
   }
}
exports.logout = async (req, res) => {
    try {
       
        res.clearCookie("expense-auth", {
            path: '/',
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV !== 'development', 
        });

       
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};