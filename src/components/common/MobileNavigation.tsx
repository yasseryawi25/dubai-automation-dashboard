import React, { useState, useRef, useEffect } from 'react';
import { Home, Users, BarChart2, MessageCircle, Settings, Menu, X, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const modules = [
  { label: 'Home', icon: <Home />, path: '/' },
  { label: 'Leads', icon: <Users />, path: '/leads' },
  { label: 'Analytics', icon: <BarChart2 />, path: '/analytics' },
  { label: 'Marketing', icon: <MessageCircle />, path: '/marketing' },
  { label: 'Orchestration', icon: <Settings />, path: '/orchestration' },
  { label: 'Profile', icon: <User />, path: '/profile' },
];

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (open && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Swipe gesture to close
  useEffect(() => {
    let startX = 0;
    let currentX = 0;
    let touching = false;
    const handleTouchStart = (e: TouchEvent) => {
      if (!open) return;
      touching = true;
      startX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!touching) return;
      currentX = e.touches[0].clientX;
      if (startX - currentX > 60) {
        setOpen(false);
        touching = false;
      }
    };
    const handleTouchEnd = () => {
      touching = false;
    };
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [open]);

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        className="fixed top-3 left-3 z-50 bg-primary-gold text-white rounded-full p-2 shadow-lg md:hidden"
        style={{ minWidth: 44, minHeight: 44 }}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity md:hidden" onClick={() => setOpen(false)}></div>
      )}
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-72 max-w-[90vw] bg-white z-50 shadow-lg transform transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ minWidth: 260 }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-primary-gold text-lg">Dubai AI Platform</span>
          <button
            className="bg-gray-100 rounded-full p-2 ml-2"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="flex-1 border-none outline-none bg-transparent text-sm"
            placeholder="Search modules..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minHeight: 44 }}
          />
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {modules.filter(m => m.label.toLowerCase().includes(search.toLowerCase())).map(m => (
            <button
              key={m.label}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-primary-gold hover:text-white transition-colors text-base font-medium"
              style={{ minHeight: 44 }}
              onClick={() => handleNavigate(m.path)}
            >
              <span className="w-6 h-6">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-gold flex items-center justify-center text-white font-bold text-lg">A</div>
          <div>
            <div className="font-semibold text-sm">Ahmad Al-Mansouri</div>
            <div className="text-xs text-gray-500">Senior Property Consultant</div>
          </div>
          <button
            className="ml-auto bg-gray-100 rounded-full p-2"
            style={{ minWidth: 44, minHeight: 44 }}
            onClick={() => handleNavigate('/profile')}
            aria-label="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation; 