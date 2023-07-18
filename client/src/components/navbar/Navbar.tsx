import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext';
import Button from '../button/Button';
import './Navbar.css'
import ProfileCard from '../profileCard/ProfileCard';

function Navbar() {
    const { user } = useAuthContext();

    return (
        <div className="navbar">
            <div className="logo">
                <h1>VisArch</h1>
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