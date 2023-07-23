import React, { useState } from 'react'
import { useRegister } from '../../../hooks/useRegister'
import TextInput from '../../../components/inputs/text/TextInput'
import '../authenticationContainer.css'

interface FormData {
    username: string
    email: string
    password: string
}

export default function Register(): JSX.Element {
    const [userData, setUserData] = useState<FormData>({ username: '', email: '', password: '' });
    const { register, loading, error } = useRegister();

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserData({...userData, [e.target.name]: e.target.value});
    }
 
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await register(userData.username, userData.email, userData.password);
    }

    return (
        <form className="registration-form" onSubmit={submit}>
            <h4> Register </h4>
            <TextInput targetName="username" type="text" label="Username" handleInput={handleOnChange}/>
            <TextInput targetName="email" type="text" label="Email" handleInput={handleOnChange}/>
            <TextInput targetName="password" type="password" label="Password" handleInput={handleOnChange}/>
            <button disabled={loading} type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    )
}