import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "danger"
}) {

    const isDanger = variant === 'danger';

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10"
                    >
                        <div className="p-6 text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 border-4 ${isDanger
                                ? 'bg-red-500/10 text-red-500 border-red-500/10'
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/10'}`}>
                                <AlertTriangle className="w-7 h-7" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                {message}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isDanger
                                        ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/20'
                                        : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-500/20'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
