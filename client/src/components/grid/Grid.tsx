export function GridElement({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      {children}
    </div>
  );
}

export default function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {children}
    </div>
  );
}