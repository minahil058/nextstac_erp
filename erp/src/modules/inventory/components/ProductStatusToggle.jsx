import { useState } from 'react';
import { clsx } from 'clsx';

export default function ProductStatusToggle({ currentStatus, onUpdate }) {
    // Treat 'Active' as on, anything else as off
    const isActive = currentStatus === 'Active';

    const handleToggle = () => {
        // Toggle between Active and Archived
        const newStatus = isActive ? 'Archived' : 'Active';
        onUpdate(newStatus);
    };

    return (
        <button
            onClick={handleToggle}
            className="group flex items-center gap-3 focus:outline-none"
            title={`Click to ${isActive ? 'Archive' : 'Activate'}`}
        >
            {/* Toggle Switch */}
            <div
                className={clsx(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner",
                    isActive ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-slate-700"
                )}
            >
                <span
                    aria-hidden="true"
                    className={clsx(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        isActive ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </div>

            {/* Status Label */}
            <span
                className={clsx(
                    "text-sm font-bold transition-colors",
                    isActive ? "text-emerald-400 drop-shadow-md" : "text-slate-500 group-hover:text-slate-400"
                )}
            >
                {currentStatus}
            </span>
        </button>
    );
}
