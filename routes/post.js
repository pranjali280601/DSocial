const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post') 
mongoose.set('useFindAndModify', false);

router.get('/allposts',requireLogin,(req,res)=>{
    Post.find() // displays all the posts in the table but doesn't display that who posted it
    .populate("postedBy","_id name pic") //therefore we mention it explicitly using the populate function
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})//show all the posts
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{ // passing middleware to makesure the user is logged in
    const{title,body,pic}=req.body // getting the title and body from the user
    if(!title || !body ){
        return res.status(422).json({error:"Please add all fields"})
    }
    req.user.password=undefined // *hence we set the password undefined so it doesn't gets displayed
     const post=new Post({  //creating a new post in the Post schema
        title,
        body,
        photo:pic,
        postedBy:req.user //gives even the pswd of the user therefore go to *
     })
     post.save().then(result=>{
         res.json({post:result})
     })
     .catch(err=>{
         console.log(err)
     })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else
        res.json(result)

    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else 
        res.json(result)

    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.newComment,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    
    .exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else
        res.json(result)

    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post)
        return res.status(422).json({error:err})
        if(post.postedBy._id.toString() === req.user._id.toString())
        {
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}) // displays all the posts in the table but doesn't display that who posted it
    .populate("postedBy","_id name") //therefore we mention it explicitly using the populate function
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})//show all the posts
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/searchposts",(req,res)=>{
    let userPattern= new RegExp(req.body.query)
    Post.find({title:{$regex:userPattern}})
    .select("_id title")
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})

router.get("/posts/:id",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.id})
    .populate("postedBy","_id name pic")
        .then((post)=>{
            

            res.json({post})
        

    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router