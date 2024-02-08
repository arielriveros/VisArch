import { useState } from 'react'
import { useLogout } from '../../hooks/useLogout';
import './ProfileCard.css'
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import Button from 'common/components/button/Button';

export default function ProfileCard(): JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(false);
    const { user }  = useAuthContext();
    const { logout } = useLogout();

    return (
        <div className='profile-card'>
            <button className='profile-btn' onClick={()=>setExpanded(true)}>
                {user?.username}
            </button>
            { expanded ? 
                <>
                    <Button onClick={logout} text='Logout' class="small" />
                    <Button onClick={()=>setExpanded(false)} text='Close' class="small" />

                </>
                :
                <></>
            }
        </div>
    )
}
