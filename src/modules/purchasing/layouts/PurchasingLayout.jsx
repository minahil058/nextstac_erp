import React from 'react';
import { Outlet } from 'react-router-dom';
import PurchasingHeader from '../components/PurchasingHeader';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';

const PurchasingLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden font-[Inter] selection:bg-purple-500/30">
            <FloatingOrbs />
            <AnimatedGrid />

            <div className="relative z-10">
                <PurchasingHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default PurchasingLayout;
