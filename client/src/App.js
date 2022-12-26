import React,{useEffect,useState,createContext,useReducer,useContext} from 'react';
import NavBar from './components/Navbar'
import './App.css'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import SignUp from './components/screens/SignUp'
import Profile from './components/screens/Profile'
import SignIn from './components/screens/SignIn'
import CreatePost from './components/screens/CreatePost'
import Reset from './components/screens/Reset'
import UserProfile from './components/screens/UserProfile'
import NewPassword from './components/screens/NewPassword'
import {reducer,initialState } from './reducers/userReducer'
import  SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import desktopImage from './img/desktopImage.jpg'
import mobileImage from './img/mobileImage.jpg'
import SearchResults from './components/screens/SearchResults';


export const UserContext=createContext()

const Routing=()=>{

  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
      
    }
    else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push("/signin")
      
    }
    

  },[])

  return (
      <Switch>
      
      <Route exact path="/signin">
      <SignIn />
      </Route>
      <Route exact path="/signup">
      <SignUp />
      </Route>
      <div>
        <NavBar/>
      
      <Route exact path="/profile">
      <Profile />
      </Route>
     
      <Route exact path="/createpost">
      <CreatePost />
      </Route>
      <Route exact path="/reset">
      <Reset />
      </Route>
      <Route exact path="/profile/:userid">
      <UserProfile />
      </Route>
      <Route exact path="/results/:postid">
      <SearchResults />
      </Route>
      <Route exact path="/reset/:token">
      <NewPassword />
      </Route>
      <Route exact path="/myfollowingpost">
      <SubscribedUserPosts />
      </Route>
      
      <Route exact path="/">
      <Home />
      </Route>
      </div>
     
      </Switch>

  )
}



function App() {
  const [state,dispatch]= useReducer(reducer, initialState)
  const imageUrl = useWindowWidth() >= 650 ? desktopImage : mobileImage;

  return (
    
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
   


 
  );
}

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
export default App;
