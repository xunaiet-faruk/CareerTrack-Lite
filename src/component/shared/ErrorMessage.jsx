import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, onClose, className = '' }) => {
    if (!message) return null;

    return (
        <div className={`
            flex items-start gap-3 p-4 
            bg-red-50 border border-red-200 
            rounded-xl text-red-700 
            animate-slideDown
            ${className}
        `}>
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                >
                    <span className="text-xl leading-none">×</span>
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;