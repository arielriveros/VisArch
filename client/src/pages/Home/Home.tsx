import { useAuthContext } from 'features/authentication/hooks/useAuthContext'
import AuthenticationContainer from 'features/authentication/containers/authenticationContainer';
import Quickguide from 'common/containers/quickguide/Quickguide';
import './Home.css'

export default function Home(): JSX.Element {
	const { user } = useAuthContext();
	return (
		<div className="va-home">
		{ user ? <Quickguide /> : <AuthenticationContainer /> }
		</div>
	)
}