import React, { useState ,useRef } from 'react'
import PushPinIcon from '@mui/icons-material/PushPin';
import "./Register.css"
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Register = ({setShowRegister}) => {
    const [success,setSuccess] = useState(false);
    const [error,setError] = useState(false);
    const url = "https://mapit-backend-8s00.onrender.com"
    
    const [data , setData] = useState({
        username:"",
        email:"",
        password:""
    })
    const onChangeHandler = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setData( (prev) =>({
            ...prev,
            [name]:value
        }))
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        console.log(data);

        try {
            await axios.post(`${url}/api/users/register` , data);
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true);
        }

    }

  return (
    <div className='registerContainer'>
        <div className="logo">
            <PushPinIcon/>Register
        </div>
        <div>
            <form onSubmit={handleSubmit} className='form-register'>
                <input type="text" placeholder='username' name='username' value={data.username} onChange={onChangeHandler}/>
                <input type="email" placeholder='email' name='email' value={data.email} onChange={onChangeHandler}/>
                <input type="password" placeholder='password' name='password' value={data.password} onChange={onChangeHandler}/>
                <button className='registerbtn'>Register</button>
                {
                    success &&
                    <span className='success'>Successful. You can login Now!</span>
                }
                {
                    error &&
                    <span className="failure">Error!</span>
                }
                
                
            </form>
            <CloseIcon className='register-cancel' onClick ={()=>setShowRegister(false)}/>
        </div>
    </div>
  )
}

export default Register
