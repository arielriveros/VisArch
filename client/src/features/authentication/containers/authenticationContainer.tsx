import React from 'react'
import Login from './login/Login'
import Register from './register/Register'
import './authenticationContainer.css'

export default function AuthenticationContainer() {
  return (
    <div className='registration-container'>
      <Login /><Register />
    </div>
  )
}
