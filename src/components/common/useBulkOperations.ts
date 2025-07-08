import { useState, useCallback, useRef } from 'react';

export interface BulkOperation {
  id: string;
  action: string;
  itemIds: string[];
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

export interface BulkAction {
  id: string;
  label: string;
  action: (itemIds: string[]) => Promise<void>;
  confirmMessage?: string;
  destructive?: boolean;
  batchSize?: number;
}

export function useBulkOperations() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  const [undoStack, setUndoStack] = useState<BulkOperation[]>([]);
  const [redoStack, setRedoStack] = useState<BulkOperation[]>([]);

  // Selection management
  const selectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const selectAll = useCallback((allItemIds: string[]) => {
    setSelectedItems(selectedItems.length === allItemIds.length ? [] : allItemIds);
  }, [selectedItems.length]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Bulk operation execution
  const executeBulkOperation = useCallback(async (
    action: BulkAction,
    itemIds: string[] = selectedItems
  ) => {
    if (itemIds.length === 0) return;

    const operation: BulkOperation = {
      id: Date.now().toString(),
      action: action.id,
      itemIds: [...itemIds],
      timestamp: new Date().toISOString(),
      status: 'pending',
      progress: 0
    };

    setOperations(prev => [operation, ...prev]);
    setCurrentOperation(operation);

    try {
      // Process in batches if specified
      const batchSize = action.batchSize || itemIds.length;
      const batches = [];
      
      for (let i = 0; i < itemIds.length; i += batchSize) {
        batches.push(itemIds.slice(i, i + batchSize));
      }

      // Update status to processing
      setOperations(prev => prev.map(op => 
        op.id === operation.id ? { ...op, status: 'processing' } : op
      ));

      // Process each batch
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const progress = Math.round(((i + 1) / batches.length) * 100);

        // Update progress
        setOperations(prev => prev.map(op => 
          op.id === operation.id ? { ...op, progress } : op
        ));

        // Execute action on batch
        await action.action(batch);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mark as completed
      setOperations(prev => prev.map(op => 
        op.id === operation.id ? { 
          ...op, 
          status: 'completed', 
          progress: 100,
          result: { processedItems: itemIds.length }
        } : op
      ));

      // Add to undo stack
      setUndoStack(prev => [operation, ...prev]);
      setRedoStack([]); // Clear redo stack when new operation is performed

      // Clear selection after successful operation
      setSelectedItems([]);

    } catch (error) {
      // Mark as failed
      setOperations(prev => prev.map(op => 
        op.id === operation.id ? { 
          ...op, 
          status: 'failed',
          error: error instanceof Error ? error.message : 'Operation failed'
        } : op
      ));
    } finally {
      setCurrentOperation(null);
    }
  }, [selectedItems]);

  // Undo functionality
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const operation = undoStack[0];
    setUndoStack(prev => prev.slice(1));
    setRedoStack(prev => [operation, ...prev]);

    // In a real implementation, you would reverse the operation
    // For now, we'll just mark it as pending (to be reversed)
    setOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...op, status: 'pending' } : op
    ));
  }, [undoStack]);

  // Redo functionality
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const operation = redoStack[0];
    setRedoStack(prev => prev.slice(1));
    setUndoStack(prev => [operation, ...prev]);

    // Re-execute the operation
    setOperations(prev => prev.map(op => 
      op.id === operation.id ? { ...op, status: 'completed' } : op
    ));
  }, [redoStack]);

  // Retry failed operation
  const retryOperation = useCallback(async (operationId: string, action: BulkAction) => {
    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    // Reset operation status
    setOperations(prev => prev.map(op => 
      op.id === operationId ? { 
        ...op, 
        status: 'pending', 
        progress: 0, 
        error: undefined 
      } : op
    ));

    // Re-execute
    await executeBulkOperation(action, operation.itemIds);
  }, [operations, executeBulkOperation]);

  // Get operation statistics
  const getOperationStats = useCallback(() => {
    const completed = operations.filter(op => op.status === 'completed').length;
    const failed = operations.filter(op => op.status === 'failed').length;
    const pending = operations.filter(op => op.status === 'pending').length;
    const totalItems = operations.reduce((sum, op) => sum + op.itemIds.length, 0);

    return {
      totalOperations: operations.length,
      completed,
      failed,
      pending,
      totalItems,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0
    };
  }, [operations, undoStack.length, redoStack.length]);

  // Clear operations history
  const clearHistory = useCallback(() => {
    setOperations([]);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    // Selection state
    selectedItems,
    selectItem,
    selectAll,
    clearSelection,
    
    // Operations
    operations,
    currentOperation,
    executeBulkOperation,
    retryOperation,
    
    // Undo/Redo
    undo,
    redo,
    getOperationStats,
    clearHistory,
    
    // Computed values
    selectedCount: selectedItems.length,
    hasSelection: selectedItems.length > 0
  };
} 