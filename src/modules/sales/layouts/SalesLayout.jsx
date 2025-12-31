import React from 'react';
import { Outlet } from 'react-router-dom';
import SalesHeader from '../components/SalesHeader';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';

const SalesLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden selection:bg-orange-500/30">
            <FloatingOrbs />
            <AnimatedGrid />
            <div className="relative z-10">
                <SalesHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default SalesLayout;
