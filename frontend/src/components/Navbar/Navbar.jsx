import React from 'react'
import { useState } from 'react';
import './Navbar.css'
import { assets } from '../../assets/assets';
import axios from 'axios'
import SearchIcon from '@mui/icons-material/Search';

const Navbar = ({currentUser , setShowLogin, setShowRegister,myStorage ,setCurrentUser ,setPins}) => {

  const url="https://mapit-backend.onrender.com";

  const [data,setData] = useState({username:""})
  const onChangeHandler = (e) =>{
    const name = e.target.name;
    const value = e.target.value;
    setData( (prev) =>({
        ...prev,
        [name]:value
    }))
  }

  const onSearch = async(e)=>{
      e.preventDefault();
      if(data.username.length === 0){
        const res = await axios.get(`${url}/api/pins`);
        if(res.data){
          setPins(res.data);
        }
        else{
          alert(res.status);
        }
      }
      else{
          const res = await axios.get(`${url}/api/pins/search?username=${data.username}`);
          if(res.data){
            setPins(res.data);
            setData({username:""})
          }
          else{
            alert(res.status);
          }
      }
      

  }
  
  
  return (
    <div className='heading'>
        <div className="heading-container">
          <h3>MAP IT</h3>
          <img src={assets.mapLogo}  className = 'logo' alt="" />
        </div>

        <div className='input-wrapper'>
          <input autoComplete='off' type="text" placeholder='Search username...' name='username' value={data.username} onChange={onChangeHandler}/>
          <SearchIcon onClick={onSearch} id='search-icon'/>
        </div>
        <div className='left'>

            {currentUser ? ( <button className='button logout' onClick={()=>{setCurrentUser(null) ,myStorage.removeItem('user') }}>LogOut</button>) 
            :(<div className="buttons">
              <button className='button login' onClick={()=>{setShowLogin(true) ;setShowRegister(false)}}>LogIn</button>
              <button className='button register' onClick={()=>{setShowRegister(true),setShowLogin(false)}}>Register</button>
          </div>)}
         
        </div>
        
    </div>
  )
}

export default Navbar
