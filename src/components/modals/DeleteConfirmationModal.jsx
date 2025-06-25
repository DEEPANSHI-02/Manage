// src/components/modals/DeleteConfirmationModal.jsx
import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  variant = "danger" // danger, warning
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [requireConfirmation, setRequireConfirmation] = useState(false);

  // Extract item name from message for confirmation typing
  const itemName = title.includes('Organization') && message.includes('"') 
    ? message.split('"')[1] 
    : null;

  React.useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
      // Require typing confirmation for critical deletions like organizations
      setRequireConfirmation(title.includes('Organization') || title.includes('Delete'));
    }
  }, [isOpen, title]);

  const handleConfirm = async () => {
    // If confirmation typing is required, validate it
    if (requireConfirmation && itemName && confirmationText !== itemName) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setLoading(false);
    }
  };

  const isConfirmationValid = !requireConfirmation || 
    (itemName && confirmationText === itemName) ||
    (!itemName && confirmationText.toLowerCase() === 'delete');

  if (!isOpen) return null;

  const iconColor = variant === 'danger' ? 'text-red-600' : 'text-yellow-600';
  const bgColor = variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100';
  const buttonColor = variant === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
    : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full ${bgColor}`}>
              <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-4">
            {message}
          </p>

          {/* Warning about consequences */}
          {title.includes('Organization') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Warning:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>All organization data will be permanently deleted</li>
                    <li>Users assigned to this organization may lose access</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation typing for critical actions */}
          {requireConfirmation && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {itemName 
                  ? `Type "${itemName}" to confirm deletion:`
                  : 'Type "DELETE" to confirm:'
                }
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={itemName || 'DELETE'}
                disabled={loading}
                autoComplete="off"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="mt-1 text-sm text-red-600">
                  {itemName 
                    ? `Please type "${itemName}" exactly as shown`
                    : 'Please type "DELETE" to confirm'
                  }
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            disabled={loading}
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !isConfirmationValid}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonColor}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Deleting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Trash2 className="h-4 w-4 mr-2" />
                {confirmButtonText}
              </div>
            )}
          </button>
        </div>

        {/* Additional context for organizations */}
        {title.includes('Organization') && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Alternative:</strong> Instead of deleting, consider deactivating the organization 
              to preserve historical data while hiding it from active use.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;