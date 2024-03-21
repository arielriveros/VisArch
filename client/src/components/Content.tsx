

interface ContentProps {
  children: React.ReactNode;
}
export default function Content(props: ContentProps) {
  return (
    <section className='flex justify-between w-full mt-6'>
      {props.children}
    </section>
  );
}
