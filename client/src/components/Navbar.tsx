import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSession from '@/hooks/useSession';
import LanguageSelector from './LanguageSelector';
import '@/styles/components/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { signedIn } = useSession();
  const { t } = useTranslation();

  return (
    <section className='navbar-container'>
      <h5 className='title' onClick={()=>navigate('/')}> VisArch </h5>
      <nav className='navbar'>
        {signedIn ?
          <>
            <Link className='navbar-link' to='/'>
              {t('navbar.home')}
            </Link>
            <Link className='navbar-link' to='/projects'>
              {t('navbar.projects')}
            </Link>
            <Link className='navbar-link' to='/user'>
              {t('navbar.profile')}
            </Link>
          </> 
          :
          <Link className='navbar-link' to='/login'>
            {t('navbar.login')}
          </Link>
        }
        <LanguageSelector />
      </nav>
    </section>
  );
}
