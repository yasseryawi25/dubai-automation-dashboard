import React from 'react';
import { useLocation } from 'react-router-dom';

export interface SidebarItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  module: string;
  items: SidebarItem[];
  collapsed?: boolean;
  onCollapse?: () => void;
  rtl?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ module, items, collapsed, onCollapse, rtl }) => {
  const location = useLocation();
  return (
    <aside
      className={`bg-white border-r border-neutral-200 h-full transition-all duration-200
        ${collapsed ? 'w-16' : 'w-64'} fixed md:static z-40 ${rtl ? 'rtl' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-primary-gold">{module}</span>
          <button onClick={onCollapse} className="md:hidden p-1 rounded hover:bg-neutral-100">
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="flex-1 py-4">
          {items.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-2 rounded-md mb-2 transition ${
                location.pathname === item.path
                  ? 'bg-primary-gold text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span className={collapsed ? 'hidden' : ''}>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 