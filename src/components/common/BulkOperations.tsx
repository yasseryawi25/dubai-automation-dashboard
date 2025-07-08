import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Edit, Copy, Download, AlertTriangle, Undo2, Loader2 } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (selectedIds: string[]) => Promise<void>;
  confirmMessage?: string;
  destructive?: boolean;
}

interface BulkOperationsProps {
  items: Array<{ id: string; [key: string]: any }>;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  actions: BulkAction[];
  onBulkAction: (action: string, ids: string[]) => Promise<void>;
  loading?: boolean;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  items,
  selectedIds,
  onSelectionChange,
  actions,
  onBulkAction,
  loading = false
}) => {
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [operationHistory, setOperationHistory] = useState<Array<{
    action: string;
    count: number;
    timestamp: string;
    status: 'success' | 'failed';
  }>>([]);

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    if (action.confirmMessage) {
      setShowConfirm(action.id);
      return;
    }
    await executeAction(action);
  };

  const executeAction = async (action: BulkAction) => {
    setProcessing(true);
    try {
      await onBulkAction(action.id, selectedIds);
      setOperationHistory(prev => [{
        action: action.label,
        count: selectedIds.length,
        timestamp: new Date().toISOString(),
        status: 'success'
      }, ...prev]);
      onSelectionChange([]);
    } catch (error) {
      setOperationHistory(prev => [{
        action: action.label,
        count: selectedIds.length,
        timestamp: new Date().toISOString(),
        status: 'failed'
      }, ...prev]);
    } finally {
      setProcessing(false);
      setShowConfirm(null);
    }
  };

  const undoLastOperation = () => {
    // Implementation for undo functionality
    console.log('Undo last operation');
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      {/* Bulk Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 md:relative md:bottom-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="p-1 hover:bg-gray-100 rounded"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                {selectedIds.length === items.length ? (
                  <CheckSquare className="w-5 h-5 text-primary-gold" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <span className="text-sm font-medium">
                {selectedIds.length} of {items.length} selected
              </span>
            </div>
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            {operationHistory.length > 0 && (
              <button
                onClick={undoLastOperation}
                className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
                style={{ minHeight: 32 }}
              >
                <Undo2 className="w-4 h-4" />
                Undo
              </button>
            )}
            {actions.map(action => (
              <button
                key={action.id}
                onClick={() => handleBulkAction(action)}
                disabled={processing}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                  action.destructive
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-primary-gold text-white hover:bg-yellow-600'
                } disabled:opacity-50`}
                style={{ minHeight: 32 }}
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold">Confirm Action</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {actions.find(a => a.id === showConfirm)?.confirmMessage}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => executeAction(actions.find(a => a.id === showConfirm)!)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 border py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operation History */}
      {operationHistory.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Recent Operations</h4>
          <div className="space-y-1">
            {operationHistory.slice(0, 3).map((op, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{op.action} ({op.count} items)</span>
                <span className={`text-xs ${op.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {op.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOperations; 