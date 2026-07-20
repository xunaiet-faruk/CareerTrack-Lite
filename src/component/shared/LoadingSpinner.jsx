
const LoadingSpinner = ({ size = 'md', color = 'indigo' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    const colorClasses = {
        indigo: 'border-indigo-600',
        white: 'border-white',
        gray: 'border-gray-600',
        purple: 'border-purple-600'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`
                ${sizeClasses[size]} 
                ${colorClasses[color]} 
                border-4 border-t-transparent 
                rounded-full animate-spin
            `} />
        </div>
    );
};

export default LoadingSpinner;