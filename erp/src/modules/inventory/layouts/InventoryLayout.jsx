import React from 'react';
import { Outlet } from 'react-router-dom';
import InventoryHeader from '../components/InventoryHeader';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';

const InventoryLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden selection:bg-teal-500/30">
            <FloatingOrbs />
            <AnimatedGrid />
            <div className="relative z-10">
                <InventoryHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default InventoryLayout;
