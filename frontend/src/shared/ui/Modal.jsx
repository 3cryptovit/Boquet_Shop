import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true
}) => {
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xlarge: 'max-w-xl',
    full: 'max-w-4xl',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t flex justify-end gap-2">
            {footer}
          </div>
        )}
        {!footer && (
          <div className="p-4 border-t flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Закрыть
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
