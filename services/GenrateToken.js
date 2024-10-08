const jwt=require("jsonwebtoken")
exports.generateToken= (userId,res)=>{
    const token= jwt.sign({
        userId,
        
    },
    process.env.JWT_SECRET,
    {expiresIn:"15d"})

    res.cookie("expense-auth",token,{
        maxAge:15*24*60*60*1000, 
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development"
    })
    
    
    return token;
}