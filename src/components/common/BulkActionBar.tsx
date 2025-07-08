import React from 'react';
import { CheckSquare, Square, X, Trash2, Edit, Copy, Download, Send, Tag, User } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  loading?: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  onSelectAll,
  isAllSelected,
  loading = false
}) => {
  if (selectedCount === 0) return null;

  const getActionStyles = (variant: string = 'primary') => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200';
      case 'secondary':
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200';
      default:
        return 'bg-primary-gold text-white hover:bg-yellow-600';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 md:relative md:bottom-auto">
      <div className="flex items-center justify-between p-4">
        {/* Selection Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              style={{ minWidth: 44, minHeight: 44 }}
              disabled={loading}
            >
              {isAllSelected ? (
                <CheckSquare className="w-5 h-5 text-primary-gold" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <span className="text-sm font-medium">
              {selectedCount} of {totalCount} selected
            </span>
          </div>
          <button
            onClick={onClearSelection}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            style={{ minHeight: 32 }}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              disabled={action.disabled || loading}
              className={`flex items-center gap-1 px-3 py-2 rounded text-sm border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getActionStyles(action.variant)}`}
              style={{ minHeight: 32 }}
            >
              {action.icon}
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Action Menu */}
      <div className="md:hidden border-t">
        <div className="flex overflow-x-auto p-2 gap-2">
          {actions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              disabled={action.disabled || loading}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded text-sm border transition-colors disabled:opacity-50 ${getActionStyles(action.variant)}`}
              style={{ minHeight: 44, minWidth: 44 }}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Predefined action sets for different modules
export const bulkActionSets = {
  leads: [
    {
      id: 'assign',
      label: 'Assign Agent',
      icon: <User className="w-4 h-4" />,
      action: () => {},
      variant: 'primary' as const
    },
    {
      id: 'tag',
      label: 'Add Tags',
      icon: <Tag className="w-4 h-4" />,
      action: () => {},
      variant: 'secondary' as const
    },
    {
      id: 'message',
      label: 'Send Message',
      icon: <Send className="w-4 h-4" />,
      action: () => {},
      variant: 'primary' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      action: () => {},
      variant: 'secondary' as const
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      action: () => {},
      variant: 'danger' as const
    }
  ],
  properties: [
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      action: () => {},
      variant: 'primary' as const
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      action: () => {},
      variant: 'secondary' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      action: () => {},
      variant: 'secondary' as const
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      action: () => {},
      variant: 'danger' as const
    }
  ],
  campaigns: [
    {
      id: 'start',
      label: 'Start',
      icon: <CheckSquare className="w-4 h-4" />,
      action: () => {},
      variant: 'primary' as const
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      action: () => {},
      variant: 'secondary' as const
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      action: () => {},
      variant: 'secondary' as const
    }
  ]
};

export default BulkActionBar; 