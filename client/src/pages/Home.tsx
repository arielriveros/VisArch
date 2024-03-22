import SS1 from '@/assets/images/ss1.png';
import SS2 from '@/assets/images/ss2.png';
import SS3 from '@/assets/images/ss3.png';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className='flex-auto text-wrap md:px-10 text-center'>
      <p className='text-xl font-bold mt-5 md:mb-10'><b>VisArch</b> is a 3D annotation tool for the web designed to provide the user the ability to annotate 3D surfaces with ease.</p>
      
      <h2 className='font-bold text-3l'> Annotate </h2>
      <div className='md:flex items-center w-full px-10 py-2'>
        <div className='xl:w-full shadow-lg shadow-gray-500 mb-5'>
          <img src={SS1} alt='Screenshot' />
        </div>
        <span className='flex-auto mx-5 md:text-left sm:text-center'>
          Annotate a surface by interacting with the 3D model. The annotation will be displayed in the 3D model and the 2D image.
        </span>
      </div>

      <h2 className='font-bold text-3l'> Collaborate </h2>
      <div className='md:flex items-center w-full px-10 pt-2 pb-10'>
        <div className='xl:w-full shadow-lg shadow-gray-500 md:order-2 mb-5'> {/* Reorder for medium screens and above */}
          <img src={SS2} alt='Screenshot' />
        </div>
        <span className='flex-auto mx-5 md:text-left sm:text-center md:order-1'> {/* Reorder for medium screens and above */}
          If your project is big or just want to make the process faster, you can invite your team to work together in the same project and annotate the 3D model at the same time.
        </span>
      </div>

      <h2 className='font-bold text-3l'> Manage </h2>
      <div className='md:flex items-center w-full px-10 pt-2 pb-10'>
        <div className='xl:w-full shadow-lg shadow-gray-500 mb-5'>
          <img src={SS3} alt='Screenshot' />
        </div>
        <span className='flex-auto mx-5 md:text-left sm:text-center'>
          Manage your projects and tasks in a single place. You can create, edit, and delete projects and tasks. You can also assign tasks to your team members.
        </span>
      </div>

      <Link to='/login'> Get Started </Link>
    </section>
  );
}
