import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-gray-100 shadow-elevated rounded-xl px-4 py-3 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
      <p className="text-sm text-text-primary font-medium">{message}</p>
      <button onClick={() => { setShow(false); onClose(); }} className="ml-2">
        <X className="w-4 h-4 text-text-tertiary hover:text-text-primary" />
      </button>
    </div>
  );
}
