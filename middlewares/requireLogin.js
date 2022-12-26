const jwt=require("jsonwebtoken")//gives unique tokens to each user to log in
const {JWT_SECRET}=require('../config/keys')
const mongoose=require('mongoose')
const User=mongoose.model("User")
mongoose.set('useFindAndModify', false);
//middleware to make sure that the user is logged in
module.exports=(req,res,next)=>{
    const{authorization}=req.headers // store the token in authorisation
    if(!authorization){
        return res.status(401).json({error: "You must be logged in"})

    }
    const token=authorization.replace("Bearer ","")// separating the token from the string
    jwt.verify(token,JWT_SECRET,(err,payload)=>{// verifying that token belongs to the same user
        if(err){
            return res.status(401).json({error:"You must be logged in"})
        }

        const{_id}=payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()//if logged in, then carry on with the process
        }) 
        
    })


}