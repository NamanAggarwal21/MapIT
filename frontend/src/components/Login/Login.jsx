import React, { useState ,useRef } from 'react'
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import "./Login.css"
import CloseIcon from '@mui/icons-material/Close';

const Login = ({setShowLogin,myStorage,setCurrentUser}) => {
    
    const [error,setError] = useState(false);
    const [data , setData] = useState({
        username:"",
        password:""
   })
    const url = 'https://mapit-backend.onrender.com';
    const onChangeHandler = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setData( (prev) =>({
            ...prev,
            [name]:value
        }))
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(data);
        try {
            const res = await axios.post(`${url}/api/users/login` , data);
            setCurrentUser(res.data.username);
            myStorage.setItem("user",res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (error) {
            setError(true);
        }

    }

  return (
    <div className='loginContainer'>
        <div className="logo">
            <LoginIcon/>Login
        </div>
        <div>
            <form onSubmit={handleSubmit} className='form-login-input'>
                <input type="text" placeholder='username'  name='username' value={data.username} onChange={onChangeHandler}/>
                <input type="password" placeholder='password' name='password' value={data.password} onChange={onChangeHandler}/>
                <button className='loginbtn'>Login</button>
                {
                    error &&
                    <span className="failure">Error!</span>
                }

            </form>
            <CloseIcon className='login-cancel' onClick ={()=>setShowLogin(false)}/>
        </div>
    </div>
  )
}

export default Login
