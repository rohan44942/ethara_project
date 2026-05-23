import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast, selectToast } from '../../store/slices/uiSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, dispatch]);

  const icons = {
    success: <CheckCircle className="text-success" size={24} />,
    error: <XCircle className="text-error" size={24} />,
    warning: <AlertCircle className="text-warning" size={24} />,
    info: <Info className="text-info" size={24} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 w-full max-w-md"
        >
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
              ${bgColors[toast.type]}
            `}
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
            <button
              onClick={() => dispatch(hideToast())}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
