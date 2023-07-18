import { useState } from 'react'
import { useLogout } from '../../hooks/useLogout';
import './ProfileCard.css'

type ProfileCardProps = {
    username: string;
    email: string;
}

export default function ProfileCard(props: ProfileCardProps): JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(false);
    const { logout } = useLogout();

    return (
        <div className='profile-card'>
            <button className='profile-card-btn' onClick={()=>setExpanded(!expanded)}>
                ☺
            </button>
            { expanded ? 
                <div className='profile-card-expanded'>
                    <p>{props.username}</p>
                    {props.email !== "" ? <p>{props.email}</p> : <></>}
                    <button className='logout-btn' onClick={logout}>Logout</button>
                </div>
                :
                <></>
            }
        </div>
    )
}
