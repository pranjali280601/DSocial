import React, { useState,useEffect, useContext } from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import desktopImage from '../../img/bg3.jpg'
import mobileImage from '../../img/mobileImage.jpg'
// import CommentIcon from '@mui/icons-material/Comment';
const Home=()=>{
    const [data,setData]=useState([])
    const {state,dispatch}=useContext(UserContext)
    const [newComment, setNewComment] = useState();
    const useWindowWidth = () => {
        const [windowWidth, setWindowWidth ] = useState(window.innerWidth);
      
        useEffect(() => {
            const handleWindowResize = () => {
                setWindowWidth(window.innerWidth);
            };
      
            window.addEventListener('resize', handleWindowResize);
            return () => window.removeEventListener('resize', handleWindowResize);
        },[]);
      
        return windowWidth;
      };

    const imageUrl = useWindowWidth() >= 650 ? desktopImage : mobileImage;
    useEffect(()=>{
        fetch("/allposts",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                setData(result.posts)
                console.log("data", data)
            })   
    },[])

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
                 <div className="home">{
                         data.map(item=>{
                        console.log("it",item)
                        return(
                            
                            <div className="card home-card" key={item._id}>
                            <div style={{
                                display:"flex",
                                justifyContent:"flex-start",
                                padding:"10px"
                                }}>
                             <div>
                                <img src={item.postedBy.pic} 
                                 className="circle responsive-img" style={{width:"40px",height:"40px",borderRadius:"20px",margin: "4px 5px 1px 4px", padding:"4px"}} />
                            </div>
                            <div className="col s12">
                            <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id : "/profile"} style={{fontSize:"18px", fontWeight:"bold", position: "relative",top:"8px"}}>
                            {item.postedBy.name}</Link> 
                        
                               {item.postedBy._id == state._id && <i className="material-icons " 
                               style={{ float:"right",color:"black", position: "relative",top:"10px",right: "2px"}} 
                                onClick={()=>{ 
                                    deletePost(item._id)
                                }}>delete</i>
                            }
                           </div>
                            </div>
                            <div className='line' style={{position: "relative",top:"-20px"}} ><hr></hr></div>
                            <div className='card-content' style={{position:"relative", top:"-50px"}}>
                            <h6 style={{color:"black", fontSize:"15px", position:"relative", top:"1%"}}> {item.title}</h6>
                                <h6 style={{color:"black", fontSize:"15px", position:"relative", top:"1%"}}> {item.body}</h6>
                            

                            <div className="card-image">
                             <img src={item.photo} style={{paddingBottom:"10px"}}/>
                            </div>
                            
                            {
                            item.likes.includes(state._id)?
                            <i className="material-icons" style={{color:"red", fontSize:"30px"}} onClick={()=>{ unlikePost(item._id)}}>favorite</i>
                            : <i className="material-icons" style={{color:"black", fontSize:"30px"}} onClick={()=>{likePost(item._id)}}>favorite_border</i>
                             }
                            <i className="material-icons" style={{color:"black", marginLeft:"13px", fontSize:"30px"}} onClick={()=>{likePost(item._id)}}>comment_icon</i>
                            <h6 style={{color:"black", fontSize:"14px"}}>{item.likes.length} likes</h6>
                            
                            
                            {
                            item.comments.map(record=>{
                                return(
                                 <h6 key={record._id} style={{color:"black", fontSize:"15px"}}><span style={{fontWeight:"bold"}}>{record.postedBy.name}</span> {record.text}</h6>
                                 ) 
                            
                            })
                            }
                          
                            <input type="text" 
                            placeholder="Add a comment"
                            value={newComment}
                            onChange={(e)=>setNewComment(e.target.value)} />
                            <button onClick={()=>makeComment(item._id)}>Post</button>
                    
                            </div>
                            </div>
                            

                         )
                    })
                     }
                     </div>
                     </div>
                    </div>
                    </div>
                    </div>
                        
    )


}
export default Home