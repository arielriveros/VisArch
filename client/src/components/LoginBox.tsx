import { API_BASE_URL } from '@/api/config';
import GoogleButton from 'react-google-button';
import GitHubLogo from '@/assets/images/github-mark.png';

export default function LoginBox() {

  const handleGoogleSSO =  async () => {
    const apiUrl = `${API_BASE_URL}/api/auth/google`;
    window.location.href = apiUrl;
  };

  const handleGithubSSO = async () => {
    const apiUrl = `${API_BASE_URL}/api/auth/github`;
    window.location.href = apiUrl;
  };

  return (
    <div className='bg-dark-blue border border-blue shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <h1 className='text-white text-xl font-bold mb-2'>Login</h1>
      <div className='flex flex-col mb-4 justify-center items-center'>
        <GoogleButton onClick={handleGoogleSSO} />
        <button className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mt-4' onClick={handleGithubSSO}>
          <img src={GitHubLogo} alt='github' className='w-6 h-6 inline-block mr-2' />
          Login with Github
        </button>
      </div>
    </div>
  );
}
