import { useState } from 'react';
import './Collapsable.css'

interface CollapsableProps {
    title: string;
    children: React.ReactNode;
}
export default function Collapsable(props: CollapsableProps) {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }
    return (
        <div className={'collapsable'}>
            <div className='collapsableHeader' onClick={toggleCollapsed}>
                <div className='collapsableTitle'>{props.title}</div>
                <div className={`collapsableArrow ${collapsed ? 'collapsed' : ''}`}>▼</div>
            </div>
            <div className={`collapsableContent ${collapsed ? 'collapsed' : ''}`}>
                {props.children}
            </div>
        </div>
    )
}
