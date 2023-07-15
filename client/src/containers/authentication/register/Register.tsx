import React from 'react'
import { useState } from 'react'
import TextInput from '../../../components/inputs/text/TextInput'
import PasswordInput from '../../../components/inputs/text/PasswordInput'
import { useRegister } from '../../../hooks/useRegister'

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
        <form className="register" onSubmit={submit}>
            <h4> Register </h4>
            <TextInput targetName="username" text="" label="Username" handleInput={handleOnChange}/>
            <TextInput targetName="email" text="" label="Email" handleInput={handleOnChange}/>
            <PasswordInput targetName="password" label="Password" handleInput={handleOnChange}/>
            <button disabled={loading} type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    )
}