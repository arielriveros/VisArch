import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import AuthenticationContainer from '../../containers/authentication/authenticationContainer';
import Quickguide from '../../containers/quickguide/Quickguide';
import './Home.css'

export default function Home(): JSX.Element {
  const { user } = useAuthContext();
  return (
    <div className="va-home">
      <h3> Home </h3>
      { user ? <Quickguide /> : <AuthenticationContainer /> }
    </div>
  )
}