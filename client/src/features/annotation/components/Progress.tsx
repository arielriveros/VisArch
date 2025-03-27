import { useEffect, useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import Emitter from '../utils/emitter';
import '../styles/Progress.css';

export default function Progress() {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onProgress = (current: number, total: number, text: string) => {
      setCurrent(current);
      setTotal(total);
      setText(text);
    };
    const onReady = () => setVisible(false); 
    Emitter.on('PROGRESS', onProgress);
    Emitter.on('READY', onReady);
    return () => {
      Emitter.off('PROGRESS', onProgress);
      Emitter.off('READY', onReady);
    };
  }, []);

  return (
    visible ?
      <section className='progress-container'>
        <p>{text}</p>
        <div className='progress-bar'>
          <ProgressBar current={current === 0 ? null : current} total={total} />
        </div>
      </section>
      : null
  );
}
