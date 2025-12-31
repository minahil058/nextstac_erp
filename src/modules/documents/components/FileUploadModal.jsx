import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, File, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUploadModal({ isOpen, onClose, onSubmit }) {
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('application/pdf');
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name: fileName,
            type: fileType,
            file: selectedFile // Pass the actual file object
        });
        setFileName('');
        setSelectedFile(null);
        onClose();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            setFileType(file.type || 'application/pdf');
            setSelectedFile(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileType(file.type || 'application/pdf');
            setSelectedFile(file);
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 flex flex-col"
                    >
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-10 backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <Upload className="w-5 h-5 text-purple-400" />
                                Upload Document
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative group overflow-hidden
                                    ${isDragging
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
                                    }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors
                                    ${isDragging ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'}`}>
                                    <Upload className="w-7 h-7" />
                                </div>
                                <p className="text-sm font-bold text-white">Click or drag file to upload</p>
                                <p className="text-xs text-slate-500 mt-1 font-medium">SVG, PNG, JPG or PDF</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                        <File className="w-3.5 h-3.5" /> File Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white placeholder:text-slate-500 transition-all font-medium"
                                        placeholder="report_q4.pdf"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" /> File Type
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white transition-all font-medium appearance-none"
                                        value={fileType}
                                        onChange={(e) => setFileType(e.target.value)}
                                    >
                                        <option value="application/pdf">PDF Document</option>
                                        <option value="image/jpeg">Image (JPG/PNG)</option>
                                        <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Spreadsheet (XLSX)</option>
                                        <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document (DOCX)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-3 border-t border-slate-800 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
