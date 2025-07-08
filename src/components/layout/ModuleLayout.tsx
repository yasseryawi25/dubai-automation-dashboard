import React, { useState } from 'react';
import Sidebar, { SidebarItem } from './Sidebar';

interface ModuleLayoutProps {
  module: string;
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ module, sidebarItems, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
      <Sidebar
        module={module}
        items={sidebarItems}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((c) => !c)}
      />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default ModuleLayout; 