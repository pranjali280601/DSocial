import React,{useState,useContext} from 'react';
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'

const NewPassword=()=>{
    
    const history=useHistory()
    const {token}=useParams()
    console.log(token)
    const[password,setPassword]=useState("")
   
   
    const PostData=()=>{
       
        fetch("/newpassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
            
        }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                   M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                     M.toast({html: data.message, classes:"#4caf50 green"})
                    history.push('/signin')
                }
            }).catch(err=>{
                console.log(err)
            })
          
        
    }
    return(
        
        <div className='mycard'>
            <div className='card auth-card input-field'>
                <h2>SocialUp</h2>
                
                <input 
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-#00b8d4 cyan accent-4"
                onClick={()=>PostData()}>
                    Update password
                </button>
                
            </div>
        </div>
        
    )


}
export default NewPassword