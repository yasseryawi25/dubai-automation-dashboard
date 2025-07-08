import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onSearchClick?: () => void;
  title?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuClick,
  onProfileClick,
  onNotificationsClick,
  onSearchClick,
  title = 'Dubai AI Platform'
}) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm md:hidden" style={{ minHeight: 56 }}>
      <button
        className="bg-primary-gold text-white rounded-full p-2 shadow"
        style={{ minWidth: 44, minHeight: 44 }}
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      <span className="font-bold text-primary-gold text-lg truncate">{title}</span>
      <div className="flex items-center gap-2">
        <button
          className="bg-gray-100 rounded-full p-2"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={onSearchClick}
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-primary-gold" />
        </button>
        <button
          className="bg-gray-100 rounded-full p-2"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={onNotificationsClick}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-primary-gold" />
        </button>
        <button
          className="bg-gray-100 rounded-full p-2"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={onProfileClick}
          aria-label="Profile"
        >
          <User className="w-5 h-5 text-primary-gold" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader; 