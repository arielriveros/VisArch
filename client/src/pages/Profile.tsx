import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/api/config';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import useSession from '@/hooks/useSession';
import Resitricted from '@/components/Restricted';
import Button from '@/components/buttons/Button';

export default function Profile() {
  const { logout, user } = useSession();
  const { t } = useTranslation();

  if (!user)
    return <Resitricted />;

  const handleDelete = async () => {
    const res = await fetch(`${API_BASE_URL}/api/users/${user.id}` , { credentials: 'include', method: 'DELETE'});
    if (res.ok)
      logout();
  };

  return (
    <section className='flex flex-col w-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center bg-dark-blue p-4 rounded-lg'>
        <h1 className='text-2xl font-bold mb-4'>
          {t('profile.title')}
        </h1>
        <div className='flex flex-row justify-center'>
          <div className='w-30 h-30'>
            {user.picture && (
              <div className='relative rounded-full w-full h-full overflow-hidden max-w-40 max-h-40'>
                <img
                  src={user.picture}
                  alt='profile'
                  style={{width: '100%', height: '100%', objectFit: 'cover',
                  }}
                />
              </div>
            )}
          </div>
          <div className='flex flex-col justify-center ml-4'>
            <div className='flex flex-col ml-4'>
              <p className='text-xl font-bold'>{user.displayName}</p>
              <p>{user.email}</p>
            </div>
            <div className='flex flex-col'>
              <Button onClick={()=>logout()}>
                {t('profile.logout')}
              </Button>
              <ConfirmButton label={t('profile.delete-profile')} onConfirm={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
