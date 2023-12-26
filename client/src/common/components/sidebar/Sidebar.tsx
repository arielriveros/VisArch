import './Sidebar.css';

interface SidebarProps {
    width: string;
    children?: React.ReactNode;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="sidebar" style={{ width: props.width }}>
        { props.children }
    </div>
  )
}
