
interface CenterProps {
  children?: React.ReactNode;
}

export default function Center(props: CenterProps) {
  return (
    <div className='bg-light-blue w-full h-full'>
      {props.children}
    </div>
  );
}
