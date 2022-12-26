import React,{useContext,useRef,useEffect,useState} from 'react';
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar=()=>{
  const searchModal=useRef(null)
  const sideTrigger=useRef(null)
  const history=useHistory()
  const [userDetails,setUserDetails]=useState([])
  const [search,setSearch]=useState("")
  const {state,dispatch}=useContext(UserContext)
 
 useEffect(()=>{
   M.Modal.init(searchModal.current)
 },[])
 useEffect(()=>{
  M.Sidenav.init(sideTrigger.current,{edge:"right",
                                      draggable:true})
},[])
 
 
  const renderList=()=>{
    if(state){
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="2" ><Link to="/profile" style={{fontFamily:"Squada One", fontSize:"20px"}}>Profile</Link></li>,
        <li key="3"><Link to="/createpost" style={{fontFamily:"Squada One", fontSize:"20px"}}>Create Post</Link></li>,
        <li key="4"><Link to="/myfollowingpost" style={{fontFamily:"Squada One", fontSize:"20px"}}>Explore</Link></li>,
       
        <li key="5">
        <button className="btn waves-effect waves-#000000 black" 
        
        onClick={()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        history.push('/signin')
        }}>
            Logout
        </button>
        </li>
      ]
    }else{
      return [
      <li key="6" style={{color:"white"}}><Link to="/signin" style={{fontFamily:"Squada One", fontSize:"20px",color: "white"}}>Login</Link></li>,
      <li key="7" ><Link to="/signup" style={{fontFamily:"Squada One", fontSize:"20px",color: "rgb(247, 224, 224)"}}>SignUp</Link></li>
    ]

    }
    }

    const fetchUsers=(query)=>{
      setSearch(query)
      fetch("/searchposts",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            query
        })       
    }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.post)
            console.log("hey",results, userDetails)
        }).catch(err=>{
            console.log(err)
        })
          
}

    return (
      <>
      <div>
             <nav>
        <div className="nav-wrapper #fffde7 yellow lighten-5">
          <div style={{
             maxWidth:"850px",margin:"0px auto" }}>
          <Link to={state?"/":"/signin"} className="brand-logo left" style={{fontSize:"40px"}}>DSocial</Link>
          <Link to={state?"/":"/signin"} data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons side" style={{position:'relative',right:"-800px"}}>menu</i></Link >
          <ul className="right hide-on-med-and-down" ref={sideTrigger}>
            {renderList()}
            </ul>
        

       
        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
            <input 
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e)=>fetchUsers(e.target.value)}          
            />
    
    <div className="collection">
      {userDetails && userDetails.map(item=>{
        return <Link to={"/results/"+item._id} onClick={()=>{
          M.Modal.getInstance(searchModal.current).close()
          setSearch('')
        }} className="collection-item">{item.title}</Link>
      })}
        {/* {userDetails && userDetails.map(item=>{
        return <p className="collection-item" >{item.title}</p>
      })} */}
        
      </div>
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
    </div>
  </div>
  </div>
  </div>   
  </nav>
  <ul className="sidenav" id="mobile-demo" ref={sideTrigger}>
  {renderList()}
  </ul>
  </div>
  </>
    )
}
export default NavBar;