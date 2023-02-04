import { useState, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../store/authContext'

 
const Auth = () => {
    const authCtx = useContext(AuthContext)
   
   
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [register, setRegister] = useState(true)
 
    const submitHandler = e => {
       e.preventDefault()
        const body = {
            username,
            password
        }
        let URL = ''
       if(register) {
        URL = `https://socialmtn.devmountain.com/register`
       } else {
        URL = `https://socialmtn.devmountain.com/login`
       }
       axios    
            .post(URL, body)
            .then((res) => {
                console.log(res.data)
                authCtx.login(res.data.token, res.data.exp, res.data.userId)
            })
            .catch((err) => {
                console.error(err)
                setUsername('')
                setPassword('')
                
            })

       
 
       console.log('submitHandler called')
   }
 
   return (
       <main>
           <h1>Welcome!</h1>
           <form className='form auth-form' onSubmit={submitHandler}>
               <input
                   className='form-input'
                   type='text'
                   placeholder='Username'                 
                   value={username}
                   onChange={(e)=> setUsername(e.target.value)}
                   />
               <input
                   className='form-input'
                   type='password'
                   placeholder='Password'
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   />
               <button className='form-btn' >
                   {register ? 'Sign Up' : 'Login'}
               </button>
           </form>
           <button className='form-btn' onClick={() => setRegister(!register)}>Need to {register ? 'Login' : 'Sign Up'}?</button>
       </main>
   )
}
 
export default Auth