import { Link } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext';
import './Navbar.css'
import Button from '../button/Button';

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
                    <Link className='navbar-link' to="/meshes">Meshes</Link>
                    {user && user.username}
                    {user && <Button text="Logout" onClick={handleLogout}/>}
                    
                </div>
            </nav>
        </div>
    )
}

export default Navbar