import React, { useState, useRef, useEffect } from 'react';
import { Clock, PenTool as Tool, CheckCircle, Package, XCircle, Archive } from 'lucide-react';
import { REPAIR_STATUS, REPAIR_STATUS_LABELS, REPAIR_STATUS_COLORS } from '../stores/repairs';

interface StatusSelectorProps {
  currentStatus: string;
  onChange: (newStatus: string) => void;
  onClose: () => void;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onChange,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case REPAIR_STATUS.PENDING:
        return <Clock className="h-5 w-5" />;
      case REPAIR_STATUS.IN_PROGRESS:
        return <Tool className="h-5 w-5" />;
      case REPAIR_STATUS.COMPLETED:
        return <CheckCircle className="h-5 w-5" />;
      case REPAIR_STATUS.DELIVERED:
        return <Package className="h-5 w-5" />;
      case REPAIR_STATUS.CANCELLED:
        return <XCircle className="h-5 w-5" />;
      case REPAIR_STATUS.ARCHIVED:
        return <Archive className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      <div className="py-1" role="none">
        {Object.entries(REPAIR_STATUS_LABELS).map(([status, label]) => (
          <button
            key={status}
            onClick={() => {
              onChange(status);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
              status === currentStatus
                ? REPAIR_STATUS_COLORS[status as keyof typeof REPAIR_STATUS_COLORS]
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            role="menuitem"
          >
            {getStatusIcon(status)}
            <span>{label}</span>
            {status === currentStatus && (
              <CheckCircle className="h-4 w-4 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};