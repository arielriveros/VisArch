import React from 'react'
import { useState } from 'react'
import TextInput from '../../components/inputs/text/TextInput'

interface FormData {
    userName: string
    email: string
    password: string
}

export default function Register(): JSX.Element {
    const [userData, setUserData] = useState<FormData>({
        userName: '',
        email: '',
        password: ''
    })

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserData({...userData, [e.target.name]: e.target.value});
    }

    function submit() {

    }

    return (
        <form className="register" onSubmit={submit}>
            <h4> Register </h4>
            <TextInput targetName="userName"    text=""  label="Username"  handleInput={handleOnChange}/>
            <TextInput targetName="email"       text=""  label="Email"     handleInput={handleOnChange}/>
            <TextInput targetName="password"    text=""  label="Password"  handleInput={handleOnChange}/>
            <button type="submit">Register</button>
        </form>
    )
}