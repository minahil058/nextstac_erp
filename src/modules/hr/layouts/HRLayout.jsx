import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import HRHeader from '../components/HRHeader';

// Floating Orbs Component
const FloatingOrbs = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-xl"
                    style={{
                        width: Math.random() * 300 + 100,
                        height: Math.random() * 300 + 100,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

// Animated Grid Background
const AnimatedGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    );
};

const HRLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative">
            <FloatingOrbs />
            <AnimatedGrid />
            <div className="relative z-10">
                <HRHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default HRLayout;
