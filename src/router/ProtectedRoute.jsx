import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Authcontext } from '../context/Authprovider';
import LoadingSpinner from '../component/shared/LoadingSpinner';


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(Authcontext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" color="indigo" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;