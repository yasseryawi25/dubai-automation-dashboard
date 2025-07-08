import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LayoutDashboard, Users, BarChart, Megaphone, Settings, Search, LogOut, UserCircle, Database } from 'lucide-react';
import LanguageToggle from '../common/LanguageToggle';
import MobileHeader from './MobileHeader';
import MobileNavigation from '../common/MobileNavigation';
import NotificationCenter from '../common/NotificationCenter';
import { useNotifications } from '../common/useNotifications';
import { useSearch } from '../common/SearchProvider';
import { useAuth } from '../../hooks/useAuth';

interface ModuleNav {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

const modules: ModuleNav[] = [
  { id: 'leads', name: 'Leads', path: '/leads', icon: <Users /> },
  { id: 'admin', name: 'Admin', path: '/admin', icon: <Settings /> },
  { id: 'analytics', name: 'Analytics & Report', path: '/analytics', icon: <BarChart /> },
  { id: 'marketing', name: 'Marketing & Listing', path: '/marketing', icon: <Megaphone /> },
  { id: 'orchestration', name: 'Orchestration', path: '/orchestration', icon: <LayoutDashboard /> },
];

const TopNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const { openSearch } = useSearch();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/login');
    }
  };

  const getUserDisplayName = () => {
    if (user?.profile?.first_name && user?.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getCompanyName = () => {
    return user?.clientProfile?.company_name || 
           user?.profile?.client_id || 
           user?.user_metadata?.company_name || 
           'Real Estate Agency';
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          onNotificationsClick={() => setNotificationOpen(true)}
          onSearchClick={openSearch}
        />
        <MobileNavigation />
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between h-16 px-6 bg-white border-b shadow-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Dubai CRM" className="h-8" />
          <span className="font-bold text-primary-gold text-lg">Dubai CRM</span>
        </Link>

        {/* Main Modules */}
        <div className="hidden md:flex space-x-4">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              to={mod.path}
              className={`flex items-center px-3 py-2 rounded-md font-medium transition ${
                location.pathname.startsWith(mod.path)
                  ? 'bg-primary-gold text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span className="mr-2">{mod.icon}</span>
              {mod.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button 
            onClick={openSearch}
            className="relative p-2 rounded-full hover:bg-neutral-100"
            title="Search (Ctrl+K)"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Search className="w-5 h-5 text-primary-gold" />
          </button>
          
          {/* Notification Bell */}
          <button 
            onClick={() => setNotificationOpen(true)}
            className="relative p-2 rounded-full hover:bg-neutral-100"
            title="Notifications"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Bell className="w-5 h-5 text-primary-gold" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          <LanguageToggle />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 p-2 rounded hover:bg-neutral-100"
            >
              <User className="w-5 h-5 text-primary-gold" />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-neutral-700">
                  {getUserDisplayName()}
                </span>
                <span className="text-xs text-neutral-500">
                  {getCompanyName()}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setProfileOpen(false)}
                />
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {user?.email}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {getCompanyName()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <UserCircle className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </Link>
                    <Link 
                      to="/database-test" 
                      className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Database className="w-4 h-4 mr-3" />
                      Database Testing
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 ml-2 rounded hover:bg-neutral-100">
          <LayoutDashboard className="w-6 h-6 text-primary-gold" />
        </button>
      </nav>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        position="top-right"
      />
    </>
  );
};

export default TopNavigation;