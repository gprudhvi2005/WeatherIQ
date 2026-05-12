import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import DynamicBackground from '../components/common/DynamicBackground';

export default function MainLayout() {
  return (
    <DynamicBackground>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <Outlet />
      </main>
    </DynamicBackground>
  );
}
