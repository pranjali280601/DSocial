import React, { useState,useEffect, useContext } from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import {useParams}  from 'react-router-dom'
import desktopImage from '../../img/bg3.jpg'
import mobileImage from '../../img/mobileImage.jpg'
// import CommentIcon from '@mui/icons-material/Comment';
const SearchResults=()=>{


    const {postid}= useParams()
    const [resPost,setresPost]=useState()
    const {state,dispatch}=useContext(UserContext)
    const [data,setData]=useState([])
    const [newComment, setNewComment] = useState();

    useEffect(()=>{
        console.log("post",postid)
        fetch(`/posts/${postid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
               setresPost(result.post)
                console.log("hello",result)
            })   
    },[])
        
    
    // const useWindowWidth = () => {
    //     const [windowWidth, setWindowWidth ] = useState(window.innerWidth);
      
    //     useEffect(() => {
    //         const handleWindowResize = () => {
    //             setWindowWidth(window.innerWidth);
    //         };
      
    //         window.addEventListener('resize', handleWindowResize);
    //         return () => window.removeEventListener('resize', handleWindowResize);
    //     },[]);
      
    //     return windowWidth;
    //   };

    // const imageUrl = useWindowWidth() >= 650 ? desktopImage : mobileImage;


    const likePost=(id)=>{
        console.log("OLD", data)
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
            .then(result=>{
                
                console.log(result)
               const newData=data.map(item=>{
                   if(item._id==result._id)
                   return result
                   else
                   return item
               })
               setData(newData)
               console.log("New",data)
            }).catch(err=>{
                console.log(err)
            }) 
        }

    const unlikePost=(id)=>{
   
            fetch("/unlike",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId:id
                })
            }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    const newData=data.map(item=>{
                        if(item._id==result._id)
                        return result
                        else
                        return item
                    })
                    setData(newData)
                }).catch(err=>{
                    console.log(err)
                }) 
            }
   
    const makeComment=(postId)=>{
        console.log(newComment)
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                newComment
            })
        }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                const newData=data.map(item=>{
                    if(item._id==result._id)
                    return result
                    else
                    return item
                })
                setData(newData)
                setNewComment("");
            }).catch(err=>{
                console.log(err)
            }) 
    }

    const deletePost=(postid)=>{
   
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                const newData=data.filter(item=>{
                    return item._id !== result._id
                })
                setData(newData)
             }).catch(err=>{
                 console.log(err)
             }) 
        }

    return(
       
        <div className="App-home" style={{backgroundImage: `url(${desktopImage})` }}>
        <div className="container">
            
        
        
        <div className="row">

         <div className="col s12  N/A transparent">
                 <div className="home">
                         
                            <div className="card home-card">
                            <div style={{
                                display:"flex",
                                justifyContent:"flex-start",
                                padding:"10px"
                                }}>
                             <div>
                                <img src={resPost && resPost.postedBy.pic} 
                                 className="circle responsive-img" style={{width:"40px",height:"40px",borderRadius:"20px",margin: "4px 5px 1px 4px", padding:"4px"}} />
                            </div>
                            <div className="col s12">
                            <Link to={resPost && (resPost.postedBy._id !== state._id?"/profile/"+resPost.postedBy._id : "/profile")} style={{fontSize:"18px", fontWeight:"bold", position: "relative",top:"8px"}}>
                            {resPost && resPost.postedBy.name}</Link> 
                        
                               {resPost && resPost.postedBy._id == state._id && <i className="material-icons " 
                               style={{ float:"right",color:"black", position: "relative",top:"10px",right: "2px"}} 
                                onClick={()=>{ 
                                    deletePost(postid)
                                }}>delete</i>
                            }
                           </div>
                            </div>
                            <div className='line' style={{position: "relative",top:"-20px"}} ><hr></hr></div>
                            <div className='card-content' style={{position:"relative", top:"-50px"}}>
                            <h6 style={{color:"black", fontSize:"15px", position:"relative", top:"1%"}}> {resPost && resPost.title}</h6>
                                <h6 style={{color:"black", fontSize:"15px", position:"relative", top:"1%"}}> {resPost && resPost.body}</h6>
                            

                            <div className="card-image">
                             <img src={resPost && resPost.photo} style={{paddingBottom:"10px"}}/>
                            </div>
                            
                            {
                            resPost && resPost.likes.includes(state._id)?
                            <i className="material-icons" style={{color:"red", fontSize:"30px"}} onClick={()=>{ unlikePost(resPost._id)}}>favorite</i>
                            : <i className="material-icons" style={{color:"black", fontSize:"30px"}} onClick={()=>{likePost(resPost._id)}}>favorite_border</i>
                             }
                            <i className="material-icons" style={{color:"black", marginLeft:"13px", fontSize:"30px"}} onClick={()=>{likePost(resPost && resPost._id)}}>comment_icon</i>
                            <h6 style={{color:"black", fontSize:"14px"}}>{resPost && resPost.likes.length} likes</h6>
                            
                            
                            {
                            resPost && resPost.comments.map(record=>{
                                return(
                                 <h6 key={record._id} style={{color:"black", fontSize:"15px"}}><span style={{fontWeight:"bold"}}>{record.postedBy.name}</span> {record.text}</h6>
                                 ) 
                            
                            })
                            }
                          
                            <input type="text" 
                            placeholder="Add a comment"
                            value={newComment}
                            onChange={(e)=>setNewComment(e.target.value)} />
                            <button onClick={()=>makeComment(resPost && resPost._id)}>Post</button>
                    
                            </div>
                            </div>
                            

                     </div>
                     </div>
                    </div>
                    </div>
                    </div>
                        
    )


}
export default SearchResults