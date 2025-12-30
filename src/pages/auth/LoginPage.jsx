import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, Shield, BarChart3, Globe, Users, Code, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    // Mouse tracking for 3D tilt effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12
            }
        }
    };

    const shineVariants = {
        initial: { backgroundPosition: '-200% 0' },
        animate: {
            backgroundPosition: '200% 0',
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
            <FloatingOrbs />
            <AnimatedGrid />

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
                <motion.div
                    className="w-full max-w-md space-y-8 relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Logo & Title */}
                    <motion.div variants={itemVariants} className="text-center lg:text-left">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 relative group"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(99, 102, 241, 0.5)",
                                    "0 0 40px rgba(168, 85, 247, 0.6)",
                                    "0 0 20px rgba(99, 102, 241, 0.5)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Shield className="w-8 h-8 text-white" />
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        <motion.h1
                            className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: '200% auto' }}
                        >
                            NEXTSTAC
                        </motion.h1>
                        <p className="mt-3 text-slate-400 flex items-center gap-2 justify-center lg:justify-start text-lg">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            Enterprise Resource Planning
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 rounded-2xl bg-red-500/10 backdrop-blur-xl text-red-400 text-sm flex items-center gap-3 border border-red-500/20"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-5">
                            {/* Email Input */}
                            <motion.div
                                className="space-y-2 group"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-400" />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50 backdrop-blur-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder-slate-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all pointer-events-none" />
                                </div>
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                className="space-y-2 group"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-indigo-400" />
                                        Password
                                    </label>
                                    <button type="button" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50 backdrop-blur-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder-slate-500 pr-14"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all pointer-events-none" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-2xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                variants={shineVariants}
                                initial="initial"
                                animate="animate"
                            />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Sign in to Dashboard
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>

                        <p className="mt-8 text-center text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </motion.form>



                    {/* Signup removed - login-only system */}
                </motion.div>
            </div>

            {/* Right Side - Interactive Showcase */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
                <div className="relative z-10 w-full max-w-lg">
                    <motion.div
                        className="grid grid-cols-2 gap-6 mb-8"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {[
                            { icon: TrendingUp, title: 'Analytics', desc: 'Real-time insights', color: 'emerald', delay: 0.5 },
                            { icon: Users, title: 'Team Sync', desc: 'Collaborate seamlessly', color: 'blue', delay: 0.6 },
                            { icon: BarChart3, title: 'Reports', desc: 'Data-driven decisions', color: 'purple', delay: 0.7 },
                            { icon: Zap, title: 'Automation', desc: 'Save hours daily', color: 'amber', delay: 0.8 }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: feature.delay, type: "spring" }}
                                whileHover={{ scale: 1.05, rotateZ: 2 }}
                                className={`bg-slate-800/50 backdrop-blur-2xl p-6 rounded-3xl border border-slate-700/50 hover:border-${feature.color}-500/50 relative group overflow-hidden cursor-pointer`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/0 to-${feature.color}-500/0 group-hover:from-${feature.color}-500/10 group-hover:to-transparent transition-all duration-500`} />
                                <feature.icon className={`w-10 h-10 text-${feature.color}-400 mb-4 relative z-10`} />
                                <h3 className="text-lg font-bold text-white relative z-10">{feature.title}</h3>
                                <p className="text-sm text-slate-400 mt-2 relative z-10">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-4xl font-black text-white">
                            Enterprise Resource
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Planning Reimagined
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Transform your business operations with our next-generation platform
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
