import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SS1 from '@/assets/images/ss1.png';
import SS2 from '@/assets/images/ss2.png';
import SS3 from '@/assets/images/ss3.png';

export default function Home() {

  const { t } = useTranslation();

  return (
    <section className='flex-auto text-wrap md:px-10 text-center'>
      <p className='text-xl font-bold mt-5 md:mb-10'>
        {t('home.welcome')}
      </p>
      
      <h2 className='font-bold text-3l'> Annotate </h2>
      <div className='md:flex items-center w-full px-10 py-2'>
        <div className='xl:w-full shadow-lg shadow-gray-500 mb-5'>
          <img src={SS1} alt='Screenshot' />
        </div>
        <span className='flex-auto mx-5 md:text-left sm:text-center'>
          {t('home.description1')}
        </span>
      </div>

      <h2 className='font-bold text-3l'> Collaborate </h2>
      <div className='md:flex items-center w-full px-10 pt-2 pb-10'>
        <div className='xl:w-full shadow-lg shadow-gray-500 md:order-2 mb-5'>
          <img src={SS2} alt='Screenshot' />
        </div>
        <span className='flex-auto mx-5 md:text-left sm:text-center md:order-1'>
          {t('home.description2')}
        </span>
      </div>

      <h2 className='font-bold text-3l'> Manage </h2>
      <div className='md:flex items-center w-full px-10 pt-2 pb-10'>
        <div className='xl:w-full shadow-lg shadow-gray-500 mb-5'>
          <img src={SS3} alt='Screenshot' />
        </div>
        <span className='flex-auto mx-5 md:text-left sm:text-center'>
          {t('home.description3')}
        </span>
      </div>

      <div className='text-xl font-bold mt-5 md:mb-10'>
        <Link to='/login'>
          {t('home.get-started')}
        </Link>
      </div>
    </section>
  );
}
