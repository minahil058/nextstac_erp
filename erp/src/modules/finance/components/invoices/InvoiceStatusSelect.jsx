import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export default function InvoiceStatusSelect({ currentStatus, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef(null);

    const statuses = ['Paid', 'Pending', 'Overdue'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
            case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
            case 'Overdue': return 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700/50';
        }
    };

    const getDotColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
            case 'Pending': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
            case 'Overdue': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
            default: return 'bg-slate-500';
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            const rect = containerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: 140 // Fixed width for dropdown
            });
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Check if click is inside the portal dropdown (which is outside containerRef)
                const dropdown = document.getElementById(`dropdown-${currentStatus}-${position.top}`);
                if (dropdown && dropdown.contains(event.target)) return;

                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false); // Close on scroll to prevent misalignment
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen, currentStatus, position.top]);

    const handleSelect = (status) => {
        if (status !== currentStatus) {
            onUpdate(status);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={toggleOpen}
                className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase transition-all min-w-[110px] justify-between group",
                    getStatusColor(currentStatus),
                    isOpen && "ring-2 ring-offset-1 ring-indigo-500/20"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", getDotColor(currentStatus))} />
                    {currentStatus}
                </div>
                <ChevronDown className={clsx("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && createPortal(
                <div
                    id={`dropdown-${currentStatus}-${position.top}`}
                    className="fixed z-[9999] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-1.5 animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: position.top - window.scrollY, // Use fixed positioning relative to viewport
                        left: position.left,
                        width: position.width
                    }}
                >
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
                </div>,
                document.body
            )}
        </div>
    );
}
