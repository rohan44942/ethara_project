import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideConfirmDialog, selectConfirmDialog } from '../../store/slices/uiSlice';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = () => {
  const dispatch = useDispatch();
  const dialog = useSelector(selectConfirmDialog);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm(dontAskAgain);
    }
    dispatch(hideConfirmDialog());
    setDontAskAgain(false);
  };

  const handleCancel = () => {
    dispatch(hideConfirmDialog());
    setDontAskAgain(false);
  };

  return (
    <Modal
      isOpen={dialog.show}
      onClose={handleCancel}
      title={dialog.title || 'Confirm Action'}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={24} />
          <p className="text-gray-700">{dialog.message}</p>
        </div>

        {dialog.showDontAskAgain && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <input
              type="checkbox"
              id="dontAskAgain"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="dontAskAgain" className="text-sm text-gray-600">
              Don't ask me again
            </label>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
