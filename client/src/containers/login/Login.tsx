import React from 'react'
import { useState } from 'react'
import TextInput from '../../components/inputs/text/TextInput'

interface FormData {
    userName: string
    password: string
}

export default function Login(): JSX.Element {
    const [userData, setUserData] = useState<FormData>({
        userName: '',
        password: ''
    })

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserData({...userData, [e.target.name]: e.target.value});
    }

    function submit() {

    }

    return (
        <form className="login" onSubmit={submit}>
            <h4> Login </h4>
            <TextInput targetName="userName"    text=""  label="Username"  handleInput={handleOnChange}/>
            <TextInput targetName="password"    text=""  label="Password"  handleInput={handleOnChange}/>
            <button type="submit">Login</button>
        </form>
    )
}