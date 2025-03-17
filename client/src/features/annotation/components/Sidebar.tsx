
interface SidebarProps {
  children?: React.ReactNode;
  width?: string;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div style={{width: props.width || '20vw', height: '100%'}}>
      {props.children}
    </div>
  );
}
