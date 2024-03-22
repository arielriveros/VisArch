import { Link, useNavigate } from 'react-router-dom';
import useSession from '@/hooks/useSession';
import '@/styles/components/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { signedIn } = useSession();

  return (
    <div className='navbar-container'>
      <h5 className='title' onClick={()=>navigate('/')}> VisArch </h5>
      <nav className='navbar'>
        {signedIn ?
          <>
            <Link className='navbar-link' to='/'>
              Home
            </Link>
            <Link className='navbar-link' to='/projects'>
              Projects
            </Link>
            <Link className='navbar-link' to='/user'>
              Profile
            </Link>
          </> 
          :
          <>
            <Link className='navbar-link' to='/login'>
              Login
            </Link>
          </>
        }
      </nav>
    </div>
  );
}
