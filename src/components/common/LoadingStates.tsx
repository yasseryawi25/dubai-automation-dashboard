import React from 'react';
import { Loader2 } from 'lucide-react';

// Main loading spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ 
  size = 'md', 
  color = 'text-primary-gold' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`${sizeClasses[size]} ${color} animate-spin`} />
  );
};

// Skeleton loader for cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg border p-4 animate-pulse ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

// Skeleton loader for tables
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg border overflow-hidden">
    <div className="p-4 border-b">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="p-4">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="text-left pb-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t">
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="py-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Skeleton loader for forms
export const FormSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Skeleton loader for dashboard cards
export const DashboardCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border p-4 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 bg-gray-200 rounded w-24"></div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-32"></div>
  </div>
);

// Skeleton loader for charts
export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border p-4 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="h-48 bg-gray-200 rounded"></div>
  </div>
);

// Skeleton loader for lists
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="bg-white rounded-lg border divide-y animate-pulse">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Progress bar
export const ProgressBar: React.FC<{ 
  progress: number; 
  label?: string; 
  color?: 'gold' | 'blue' | 'green' | 'red' 
}> = ({ progress, label, color = 'gold' }) => {
  const colorClasses = {
    gold: 'bg-primary-gold',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  return (
    <div className="w-full">
      {label && <div className="text-sm text-gray-600 mb-1">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{progress}%</div>
    </div>
  );
};

// Shimmer effect component
export const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}></div>
);

// Full page loading
export const FullPageLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-primary-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <div className="text-lg font-semibold text-gray-700 mb-2">جاري التحميل...</div>
      <div className="text-sm text-gray-500">Loading...</div>
    </div>
  </div>
);

// Module-specific loading patterns
export const ModuleLoading = {
  Dashboard: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ListSkeleton items={3} />
      </div>
    </div>
  ),
  
  Table: () => <TableSkeleton rows={8} columns={5} />,
  
  Form: () => <FormSkeleton />,
  
  Cards: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}; 