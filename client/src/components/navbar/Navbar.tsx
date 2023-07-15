import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {

    return (
        <div className="navbar">
            <div className="logo">
                <h1>VisArch</h1>
            </div>
            <nav>
                <div className="navigation">
                    <Link className='navbar-link' to="/">Home</Link>
                    <Link className='navbar-link' to="/meshes">Meshes</Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar