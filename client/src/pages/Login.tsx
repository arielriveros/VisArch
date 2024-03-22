import LoginBox from '@/components/LoginBox';


export default function Login() {
  return (
    <section className='flex-auto text-wrap md:px-10 text-center'>
      <div className='flex justify-center'>
        <div className='w-full max-w-md'>
          <LoginBox />
        </div>
      </div>
    </section>
  );
}
