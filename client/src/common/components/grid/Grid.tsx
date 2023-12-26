import { ReactNode } from 'react'
import './Grid.css'

interface GridItemProps {
    children: ReactNode;
    onClick?: () => void;
}

export function GridItem(props: GridItemProps) {
    return (
        <div className='GridItem' onClick={props.onClick}>
            {props.children}
        </div>
    )
}

interface GridProps {
    children: ReactNode;
}

export default function Grid(props: GridProps) {
  return (
    <div className='GridContainer'>
        <div className='Grid'>
            {props.children}
        </div>
    </div>
  )
}
