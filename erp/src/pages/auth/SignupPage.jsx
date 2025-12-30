import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, Shield, Briefcase, Sparkles, Zap, Star, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating Orbs Component (reused)
const FloatingOrbs = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"
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
                        linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    );
};

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [department, setDepartment] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await register(name, email, password, role, department);
            if (result.success) {
                navigate('/');
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
            transition: { staggerChildren: 0.08, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120, damping: 12 }
        }
    };

    const shineVariants = {
        initial: { backgroundPosition: '-200% 0' },
        animate: {
            backgroundPosition: '200% 0',
            transition: { duration: 3, repeat: Infinity, ease: "linear" }
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
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
                            className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 relative group"
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(168, 85, 247, 0.5)",
                                    "0 0 40px rgba(236, 72, 153, 0.6)",
                                    "0 0 20px rgba(168, 85, 247, 0.5)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Rocket className="w-8 h-8 text-white" />
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        <motion.h1
                            className="text-4xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            style={{ backgroundSize: '200% auto' }}
                        >
                            Start Your Journey
                        </motion.h1>
                        <p className="mt-3 text-slate-400 flex items-center gap-2 justify-center lg:justify-start">
                            <Star className="w-4 h-4 text-purple-400" />
                            Create your account in seconds
                        </p>
                    </motion.div>

                    <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
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

                        <div className="space-y-4">
                            {/* Role and Department are predetermined by the invitation, so we hide these selectors */}


                            {/* Name */}
                            <motion.div
                                className="space-y-2 group"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-400" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-slate-500"
                                    placeholder="John Doe"
                                    required
                                />
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                className="space-y-2 group"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-purple-400" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-slate-500"
                                    placeholder="name@company.com"
                                    required
                                />
                            </motion.div>

                            {/* Password */}
                            <motion.div
                                className="space-y-2 group"
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <label className="text-sm font-bold text-slate-300 ml-1 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-purple-400" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-700/50 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-slate-500 pr-14"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-2xl font-bold shadow-2xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed mt-6"
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
                                        Create My Account
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </motion.form>

                    {/* Sign In Link */}
                    <motion.div variants={itemVariants} className="text-center pt-6 border-t border-slate-700/50">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all">
                                Sign In →
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Side - Showcase */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
                <div className="relative z-10 w-full max-w-lg text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                    >
                        <h2 className="text-5xl font-black text-white mb-4">
                            Join 10,000+
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                                Growing Businesses
                            </span>
                        </h2>
                        <p className="text-slate-400 text-xl">
                            Start scaling your operations today with our all-in-one platform
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex justify-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {[
                            { value: "99%", label: "Uptime" },
                            { value: "24/7", label: "Support" },
                            { value: "1M+", label: "Transactions" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
