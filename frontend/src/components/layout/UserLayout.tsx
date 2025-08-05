// src/layouts/UserLayout.tsx

import type { ReactNode } from 'react';
import Header from '../../components/user/Header';
import HomePage from '../../page/Home';
 
interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <HomePage/>
      
      <main className="p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
