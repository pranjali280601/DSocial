const express = require("express")
const router = express.Router()
const mongoose=require('mongoose')
const User=mongoose.model("User")
const bcrypt=require("bcryptjs")
const crypto=require('crypto')
const jwt=require("jsonwebtoken")
const requireLogin=require("../middlewares/requireLogin")
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
mongoose.set('useFindAndModify', false);



const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.SENDGRID_API
    }
}))

router.post('/signup',(req,res)=>{
    const{name,email,password,pic}=req.body
    if(!email || !name || !password)
    {
       return res.status(422).json({error:'Please add all credentials'})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User email already exists"})
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            const user=new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"pranjalsharma2806@gmail.com",
                    subject:"Signup Success",
                    html:"<h1>Welcome to SocialUp</h1?"
                })
                res.json({message:"Saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    }).catch(err=>{
        console.log(err)
    })
})
router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password)
    {
       return res.status(422).json({error:'Please add all credentials'})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Incorrect email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
                const {_id,name,email,followers,following,pic}=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
                //res.json({message:"Successfully signed in"})
            }
            else{
                return res.status(422).json({error:"Incorrect email or password"})
            }
        })
   
    .catch(err=>{
         console.log(err)
         })
    })
})

router.post("/resetpassword",(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token=buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist"})

            }
            user.resetToken=token
            user.expireToken=Date.now()+3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"pranjalsharma2806@gmail.com",
                    subject:"Password Reset",
                    html:`
                    <p>A request for password reset has been generated from your account.</p>
                    <h5>Click on this <a href="${process.env.EMAIL}/reset/${token}">Link</a> to reset password</h5>
                    `
                })
                res.json({message:"Check your email"})
            })
        })
    })

})

router.post("/newpassword",(req,res)=>{
    const newPassword=req.body.password
    const sentToken=req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user)
        return res.status(422).json({error:"Session Expired. Please try again."})
    
        bcrypt.hash(newPassword,12)
            .then(hashedpassword=>{
            user.password=hashedpassword
            user.resetToken=undefined
            user.expireToken=undefined
            user.save().then((saveduser)=>{
                res.json({message:"Password Updated Succesfully"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports=router
   