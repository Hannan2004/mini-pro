import { useRouter } from 'next/router';
import { FC, ReactNode, useState } from 'react';
import { BellIcon, ClipboardDocumentIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface MenuItemProps {
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ label, icon, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
      isActive ? 'bg-gray-700' : 'hover:bg-gray-600'
    }`}
  >
    {icon}
    <span className="text-lg">{label}</span>
  </div>
);

const Sidebar: FC = () => {
  const router = useRouter();
  const [active, setActive] = useState('/alerts'); // Default active section

  const navigate = (path: string) => {
    setActive(path);
    router.push(path);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <MenuItem
          label="Alerts"
          icon={<BellIcon className="h-6 w-6" />}
          isActive={active === '/alerts'}
          onClick={() => navigate('/alerts')}
        />
        <MenuItem
          label="Logs"
          icon={<ClipboardDocumentIcon className="h-6 w-6" />}
          isActive={active === '/logs'}
          onClick={() => navigate('/logs')}
        />
        <MenuItem
          label="Reports"
          icon={<DocumentIcon className="h-6 w-6" />}
          isActive={active === '/reports'}
          onClick={() => navigate('/reports')}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
