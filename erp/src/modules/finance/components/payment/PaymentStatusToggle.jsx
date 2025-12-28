import { ArrowUpRight, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function PaymentStatusToggle({ currentStatus, onUpdate }) {
    const statuses = ['Paid', 'Pending', 'Failed'];

    const getNextStatus = () => {
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return statuses[nextIndex];
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Paid':
                return {
                    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
                    icon: ArrowUpRight
                };
            case 'Pending':
                return {
                    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
                    icon: Clock
                };
            case 'Failed':
                return {
                    className: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
                    icon: AlertCircle
                };
            default:
                return {
                    className: 'bg-slate-800 text-slate-400 border-slate-700/50',
                    icon: ArrowUpRight
                };
        }
    };

    const config = getStatusConfig(currentStatus);
    const Icon = config.icon;

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdate(getNextStatus())}
            className={clsx(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border transition-colors select-none cursor-pointer",
                config.className
            )}
            title="Click to cycle status"
        >
            <Icon className="w-3.5 h-3.5" />
            {currentStatus}
        </motion.button>
    );
}
