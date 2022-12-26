import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'
const CreatePost=()=>{
    const history=useHistory()
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    
    useEffect(()=>{
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
            
        }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                   M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                    M.toast({html: "Posted Successfully", classes:"#4caf50 green"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            }) 
        }
    },[url]) //this will kick in when the url is set at line 24

    const postDetails=()=>{
        const data= new FormData()
        data.append("file",image)
        data.append("upload_preset","insta_clone")
        data.append("cloud_name","pranjaliinsta")
        fetch("	https://api.cloudinary.com/v1_1/pranjaliinsta/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
        
    }


    return(
        <div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input 
            type="text" 
            placeholder="Title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)} 
            />
            <input 
            type="text" 
            placeholder="Body"
            value={body}
            onChange={(e)=>setBody(e.target.value)} 
            />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-#000000 black">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-#000000 black"
            onClick={()=>postDetails()}>
                    Post
            </button>
        </div>
    )

}
export default CreatePost