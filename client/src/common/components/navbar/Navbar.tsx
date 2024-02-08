import { Link } from 'react-router-dom'
import { useAuthContext } from '../../../features/authentication/hooks/useAuthContext';
import ProfileCard from '../../../features/authentication/containers/profileCard/ProfileCard';
import './Navbar.css'

interface NavbarProps {
    children?: React.ReactNode
}
function Navbar(props: NavbarProps) {
    const { user } = useAuthContext();

    return (
        <div className="navbar">
            <div className="logo">
                <h1></h1>
            </div>
            <nav>
                { user && 
                    <div className="navigation">
                        {props.children}
                    </div>
                }
            </nav>
        </div>
    )
}

export default Navbar