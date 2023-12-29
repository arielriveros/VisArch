import './Sidebar.css';

interface SidebarProps {
    width: string;
    position: 'left' | 'right';
    children?: React.ReactNode;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="sidebar" style={{ width: props.width, float: props.position, right: props.position === 'right' ? '0px' : 'auto'}}>
        { props.children }
    </div>
  )
}
