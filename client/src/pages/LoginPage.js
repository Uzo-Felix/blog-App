import { useState, useContext } from "react";
import {Navigate} from 'react-router-dom';
import {UserContext} from '../UserContext';

const apiURL = process.env.REACT_APP_API_URL;
export default function LoginPage(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    const login = async(event) =>{
        event.preventDefault();
        const response = await fetch(`${apiURL}/login`,{
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers:{'Content-Type': 'application/json'},
            credentials: 'include',
        });
        if(response.ok){
            response.json().then(userInfo => {
                setUserInfo(userInfo)
                setRedirect(true);
            })
        } else{
            alert('wrong credentials');
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    return (    
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" 
            placeholder="username" 
            value={username}
            onChange={event => setUsername(event.target.value)}/>
            <input type="password" 
            placeholder="password" 
            value={password}
            onChange={event => setPassword(event.target.value)}/>
            <button>Login</button>
        </form>
    );
}