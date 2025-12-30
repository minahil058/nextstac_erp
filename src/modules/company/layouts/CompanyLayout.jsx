import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanyHeader from '../components/CompanyHeader';

const CompanyLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <CompanyHeader />
            <Outlet />
        </div>
    );
};

export default CompanyLayout;
