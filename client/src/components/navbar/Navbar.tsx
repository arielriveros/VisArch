import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext';
import Button from '../button/Button';
import './Navbar.css'

function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    function handleLogout() {
        logout();
    }

    return (
        <div className="navbar">
            <div className="logo">
                <h1>VisArch</h1>
            </div>
            <nav>
                <div className="navigation">
                    <Link className='navbar-link' to="/">Home</Link>
                    {user && <Link className='navbar-link' to="/projects">Projects</Link>}
                    {user && user.username}
                    {user && <Button text="Logout" onClick={handleLogout}/>}
                    
                </div>
            </nav>
        </div>
    )
}

export default Navbar