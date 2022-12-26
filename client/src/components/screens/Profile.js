import React,{useEffect,useState,useContext} from 'react';
import { Link } from 'react-router-dom';
import {UserContext} from "../../App"
import desktopImage from '../../img/bg3.jpg'

const Profile=()=>{
    const [mypics,setPics]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const[image,setImage]=useState("")
    const[url,setUrl]=useState()

    useEffect(()=>{
        fetch("/mypost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                setPics(result.mypost)
            })   
    },[])

    useEffect(()=>{
        if(image){
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
                localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                dispatch({
                    type:"UPDATEPIC",
                    payload:data.url
                })
                fetch("/updatepic",{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                    .then(result=>{
                        
                        console.log(result)
                        localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                        dispatch({type:"UPDATEPIC",payload:result.pic})
                       })
                      
                    }).catch(err=>{
                        console.log(err)
                    }) 
                // window.location.reload()
            }
        },[image])
    
    const uploadPhoto=(file)=>{
        setImage(file) 
    }
    return(
        <div className="App-home" style={{backgroundImage: `url(${desktopImage})` }}>
        <div className="container">
           
           <div className="row">

            <div className="col s12 #fffde7 yellow lighten-5">
        <div style={{
            maxWidth:"650px",margin:"0px auto"
        }}>
            <div className="col s12" style={{
                margin:"18px 10px",
                borderBottom:"1px solid grey"
            }} >
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                
            }}>
                <div className="col s10 m6 l3 #fffde7 yellow lighten-5" >
                    <img src={state?state.pic:"Loading..."}
                    style={{position:"relative", width:"180px",height:"180px",borderRadius:"90px" }}
                    />
                </div>
                <div className="col s3 m6 l3 #fffde7 yellow lighten-5" >
                    <h4>{state?state.name:"Loading..."}</h4>
                    <h5>{state?state.email:"Loading..."}</h5>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width: "108% "
                    }}>
                        <h6>{mypics.length} posts</h6>
                        
                        <h6>{state?state.followers.length : "0"} Followers</h6>
                        <h6>{state?state.following.length : "0"} Following</h6>
                    </div>
                    
                </div>
            </div>
        
            <div className="file-field input-field" >
                <div className="btn waves-effect black" style={{width:"35%"}}>
                    <span>Update pic</span>
                    <input type="file" onChange={(e)=>uploadPhoto(e.target.files[0])} />
                </div>
               
                </div>
                </div>
               </div>

        <div className="row">
        <div className="col s12 #fffde7 yellow lighten-5 gallery">
            {
                mypics.map(item=>{
                    return (
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />

                    )
                })
            }
            
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    )


}
export default Profile