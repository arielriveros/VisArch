import React from 'react'
import { useState } from 'react'
import { useLogin } from 'features/authentication/hooks/useLogin'
import TextInput from 'common/components/input/TextInput'
import '../authenticationContainer.css'
import Button from 'common/components/button/Button'

interface FormData {
    username: string
    password: string
}

export default function Login(): JSX.Element {
    const [userData, setUserData] = useState<FormData>({ username: '', password: '' });
    const { login, loading, error } = useLogin();

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserData({...userData, [e.target.name]: e.target.value});
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await login(userData.username, userData.password);
    }

    return (
        <form className="registration-form" onSubmit={submit}>
            <h4> Login </h4>
            <TextInput targetName="username" type="text" label="Username" handleInput={handleOnChange}/>
            <TextInput targetName="password" type="password" label="Password" handleInput={handleOnChange}/>
            { !loading && <Button onClick={()=>submit} class='medium' text={'Login'}/>}
            {error && <p>{error}</p>}
        </form>
    )
}