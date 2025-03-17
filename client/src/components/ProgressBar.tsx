
interface ProgressBarProps {
  current: number | null;
  total?: number;
}
export default function ProgressBar(props: ProgressBarProps) {
  const { current, total } = props;

  return (current === null) ?
    // animate the progress bar
    <div className='w-full h-4 bg-gray-200 animate-pulse' />
    :
    <progress className='w-full bg-gray-200 color-blue-500' value={current} max={total} />;
}