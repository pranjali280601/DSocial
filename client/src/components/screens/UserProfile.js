import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from "../../App"
import {useParams}  from 'react-router-dom'
const UserProfile=()=>{
    const {userid}= useParams()
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const [showfollow,setShowFollow]=useState(state?!state.following.includes(userid):true)
    
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
            .then(result=>{
               setProfile(result)
                
            })   
    },[])

    const followUser=()=>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    return {
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }

                    }
                })
                setShowFollow(false);
            }).catch(err=>{
                console.log(err)
            }) 
        }

        const unfollowUser=()=>{
            fetch("/unfollow",{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    unfollowId:userid
                })
            }).then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                    
                    localStorage.setItem("user",JSON.stringify(data))
                    setProfile((prevState)=>{
                        const newFollower=prevState.user.followers.filter(item=>item != data._id)
                        return {
                            ...prevState,
                            user:{
                                ...prevState.user,
                                followers:newFollower
                            }
    
                        }
                    })
                    setShowFollow(true)
                }).catch(err=>{
                    console.log(err)
                }) 
            }

    return(
        <>;
        {userProfile?
        <div style={{
            maxWidth:"650px",margin:"0px auto"
        }}>
            <div style={{

                display:"flex",
                justifyContent:"space-around",
                margin:"18px 10px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"180px",height:"180px",borderRadius:"90px",margin:"15px 20px"}}
                    src={userProfile.user.pic}
                    />

                </div>
                <div>
                <h4>{userProfile.user.name}</h4>
                    <h4>{userProfile.user.email}</h4>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width: "60% "
                    }}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} Followers</h6>
                        <h6>{userProfile.user.following.length} Following</h6>
                    </div>
                    {
                        showfollow?
                        <button 
                        style={{
                            margin:"10px",
                            height:"25px",
                            width:"100px",
                           
                        }}className="btn waves-effect waves-#00b8d4 cyan accent-4"
                            onClick={()=>followUser()}>
                             Follow
                        </button>
                        :
                        <button style={{
                            margin:"10px",
                            height:"25px",
                            width:"100px",
                            
                        }} className="btn waves-effect waves-#00b8d4 cyan accent-4"
                             onClick={()=>unfollowUser()}>
                            Unfollow
                        </button>

                    }
                    
                
                </div>
            </div>
        <div className="gallery">
            {
                userProfile.posts.map(item=>{
                    return (
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />

                    )
                })
            }
            
        </div>
        </div>
         : <h2>Loading...</h2>}
        
        </>
    )


}
export default UserProfile