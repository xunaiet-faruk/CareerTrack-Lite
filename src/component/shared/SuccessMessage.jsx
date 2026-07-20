import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const SuccessMessage = ({ message, onClose, className = '' }) => {
    if (!message) return null;

    return (
        <div className={`
            flex items-start gap-3 p-4 
            bg-emerald-50 border border-emerald-200 
            rounded-xl text-emerald-700 
            animate-slideDown
            ${className}
        `}>
            <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-emerald-400 hover:text-emerald-600 transition-colors"
                >
                    <span className="text-xl leading-none">×</span>
                </button>
            )}
        </div>
    );
};

export default SuccessMessage;