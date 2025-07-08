import React from 'react';
import TopNavigation from './TopNavigation';
import ConnectionStatus from '../common/ConnectionStatus';
import { SearchProvider } from '../common/SearchProvider';
import GlobalSearch from '../common/GlobalSearch';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SearchProvider>
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="w-full flex justify-center py-1 bg-white border-b z-30 sticky top-0">
        <ConnectionStatus />
      </div>
      <TopNavigation />
      <main className="flex-1 flex flex-col">{children}</main>
      <GlobalSearch />
    </div>
  </SearchProvider>
);

export default Layout; 