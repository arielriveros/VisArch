import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Content from '@/components/Content';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Content>
        <Outlet />
      </Content>
    </>
  );
}
