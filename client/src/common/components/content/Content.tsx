import { ReactNode } from 'react'
import './Content.css'

interface ContentProps {
    children: ReactNode;
};

export default function Content(props: ContentProps) {
  return (
    <div className='Content'>
        {props.children}
    </div>
  )
}
