import { motion } from 'framer-motion';

export const PremiumCard = ({
    children,
    className = "",
    hover = true,
    gradient = false,
    onClick,
    ...props
}) => {
    return (
        <motion.div
            className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 ${gradient ? 'hover:border-indigo-500/50' : ''
                } ${className}`}
            whileHover={hover ? { scale: 1.02, y: -4 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const PremiumButton = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    loading = false,
    ...props
}) => {
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white",
        secondary: "bg-slate-700/50 text-slate-200 hover:bg-slate-700",
        outline: "border-2 border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-white",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            className={`rounded-xl font-bold relative overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {variant === "primary" && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ backgroundSize: '200% 100%' }}
                />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export const StatCard = ({ icon: Icon, label, value, trend, color = "indigo" }) => {
    const colors = {
        indigo: "from-indigo-500 to-purple-500",
        emerald: "from-emerald-500 to-teal-500",
        amber: "from-amber-500 to-orange-500",
        pink: "from-pink-500 to-rose-500",
        blue: "from-blue-500 to-cyan-500",
    };

    return (
        <PremiumCard className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-slate-400 font-semibold mb-2">{label}</p>
                    <motion.p
                        className="text-3xl font-black text-white"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        {value}
                    </motion.p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Icon className="w-7 h-7 text-white" />
                </motion.div>
            </div>
        </PremiumCard>
    );
};
