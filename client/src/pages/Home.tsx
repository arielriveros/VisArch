import React from 'react'
import Register from '../containers/register/Register'
import Login from '../containers/login/Login'


export default function Home() {
  return (
    <div>
      <h3> Home </h3>
      <Login />
      <Register />
    </div>
  )
}