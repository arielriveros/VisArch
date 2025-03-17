
interface CenterProps {
  children?: React.ReactNode;
}

export default function Center(props: CenterProps) {
  return (
    <section className='bg-light-blue w-full h-full'>
      <div className='flex flex-col w-full h-full relative'>
        {props.children}
      </div>
    </section>
  );
}
