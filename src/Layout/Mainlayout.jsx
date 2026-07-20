import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../component/shared/Navbar';
import Footer from '../component/shared/Footer';


const MainLayout = () => {
    return (
        <div className="">
            <Navbar />
            <main className="min-h-screen">
                <Outlet /> 
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;