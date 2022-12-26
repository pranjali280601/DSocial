import React,{useState,useContext, useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
import desktopImage from '../../img/desktopImage.jpg'
import mobileImage from '../../img/mobileImage.jpg'
const SignIn=()=>{
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const[password,setPassword]=useState("")
    const[email,setEmail]=useState("")
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
    const PostData=()=>{
        if (! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
        {
          return M.toast({html: "Invalid email",classes:"#f44336 red"})
        }
        
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
            
                email,
                password
            })
            
        }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                   M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html: "Signed in successfully", classes:"#4caf50 green"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
          
        
    }
    return(
        <div className="App" style={{backgroundImage: `url(${imageUrl})` }}>
       
        <div className="container">
            <div className="row">
        <div className="col s6">
        <div className='mycard'>
            <div className='card auth-card input-field ' >
                <h2 style={{color:"black"}}>SocialUp</h2>
                <input style={{color:"black"}}
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-#000000 black"
                style={{borderRadius:"20px"}}
                onClick={()=>PostData()}>
                    LOGIN
                </button>
                <h5 style={{fontSize:"15px",fontFamily: 'Roboto Mono'}}>
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                    
                </h5>
                <h6 style={{fontSize:"15px",fontFamily: 'Roboto Mono'}}>
                    <Link to="/reset">Forgot Password</Link>
                </h6>
            </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        
    )


}
export default SignIn