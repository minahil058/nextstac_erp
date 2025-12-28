import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export default function ProductStatusSelect({ currentStatus, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const statuses = ['Active', 'Draft', 'Archived'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
            case 'Draft': return 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50';
            case 'Archived': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const getDotColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
            case 'Draft': return 'bg-slate-500';
            case 'Archived': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
            default: return 'bg-slate-500';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (status) => {
        if (status !== currentStatus) {
            onUpdate(status);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase transition-all min-w-[110px] justify-between group",
                    getStatusColor(currentStatus),
                    isOpen && "ring-2 ring-offset-1 ring-indigo-500/20"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", getDotColor(currentStatus))} />
                    {currentStatus || 'Active'}
                </div>
                <ChevronDown className={clsx("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-[140px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleSelect(status)}
                            className={clsx(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors mb-0.5 last:mb-0",
                                status === currentStatus
                                    ? "bg-slate-700 text-white"
                                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className={clsx("w-1.5 h-1.5 rounded-full", getDotColor(status))} />
                                {status}
                            </div>
                            {status === currentStatus && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
