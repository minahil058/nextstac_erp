import React from 'react';
import { Outlet } from 'react-router-dom';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';

const AuditLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative font-[Inter] selection:bg-indigo-500/30">
            <FloatingOrbs />
            <AnimatedGrid />

            <div className="relative z-10 px-4 md:px-6 py-6 max-w-[1920px] mx-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default AuditLayout;
