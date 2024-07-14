import React from 'react'
import { useState } from 'react';
import './Navbar.css'
import { useMapEvents,Marker,Popup, MapContainer } from 'react-leaflet';
import NearMeIcon from '@mui/icons-material/NearMe';
import { assets } from '../../assets/assets';
import { Icon } from '@mui/material';

const Navbar = ({currentUser , setShowLogin, setShowRegister,myStorage ,setCurrentUser }) => {

  
  
  return (
    <div className='heading'>
        <div className="heading-container">
          <h3>MAP IT</h3>
          <img src={assets.mapLogo}  className = 'logo' alt="" />
        </div>
        <div className='left'>

            {currentUser ? ( <button className='button logout' onClick={()=>{setCurrentUser(null) ,myStorage.removeItem('user') }}>LogOut</button>) 
            :(<div className="buttons">
              <button className='button login' onClick={()=>setShowLogin(true)}>LogIn</button>
              <button className='button register' onClick={()=>setShowRegister(true)}>Register</button>
          </div>)}
         
        </div>
        
    </div>
  )
}

export default Navbar