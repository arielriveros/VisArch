import { Link } from 'react-router-dom'
import { useAuthContext } from '../../../features/authentication/hooks/useAuthContext';
import ProfileCard from '../profileCard/ProfileCard';
import './Navbar.css'

function Navbar() {
    const { user } = useAuthContext();

    return (
        <div className="navbar">
            <div className="logo">
                <h1></h1>
            </div>
            <nav>
                { user && 
                    <div className="navigation">
                        <Link className='navbar-link' to="/">Home</Link>
                        <Link className='navbar-link' to="/projects">Projects</Link>
                        <ProfileCard username={user.username} email={""} />
                    </div>
                }
            </nav>
        </div>
    )
}

export default Navbar