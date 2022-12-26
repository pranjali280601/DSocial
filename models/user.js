const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
//creating the user info database
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:ObjectId,
        ref:"User"

    }],
    following:[{
        type:ObjectId,
        ref:"User"

    }],
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/pranjaliinsta/image/upload/v1621955535/images_dldwev.png"

    }
})

mongoose.model("User",userSchema)