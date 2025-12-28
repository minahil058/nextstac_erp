import { useState } from 'react';
import { Check, X, Calendar, DollarSign, AlignLeft, ChevronDown } from 'lucide-react';

const JournalEntryForm = ({ onPostEntry, accounts }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [debitAccountId, setDebitAccountId] = useState('');
    const [creditAccountId, setCreditAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Filter accounts
    const filterAccounts = (type) => accounts.filter(a => a.type === type);
    const assetAccounts = filterAccounts('Asset');
    const liabilityAccounts = filterAccounts('Liability');
    const equityAccounts = filterAccounts('Equity');
    const revenueAccounts = filterAccounts('Revenue');
    const expenseAccounts = filterAccounts('Expense');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const debitAccount = accounts.find(a => a.id === debitAccountId);
        const creditAccount = accounts.find(a => a.id === creditAccountId);

        const entry = {
            date,
            description,
            debit_account_id: debitAccountId,
            credit_account_id: creditAccountId,
            debitAccount,
            creditAccount,
            amount: parseFloat(amount)
        };

        const success = await onPostEntry(entry);

        setIsSubmitting(false);

        if (success) {
            setShowSuccess(true);
            setDescription('');
            setDebitAccountId('');
            setCreditAccountId('');
            setAmount('');
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const isFormValid =
        description &&
        debitAccountId &&
        creditAccountId &&
        amount > 0 &&
        debitAccountId !== creditAccountId;

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-700/50 p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            {/* Success Toast */}
            {showSuccess && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-right duration-300 z-10">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Entry Recorded</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Top Row: Date & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 relative z-10">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Date</label>
                        <div className="relative group">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-4 pr-10 py-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white font-medium shadow-inner"
                                required
                            />
                            <Calendar className="absolute right-4 top-4 w-5 h-5 text-slate-500 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Amount</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-4 font-bold text-slate-500 group-focus-within:text-indigo-400 transition-colors">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-bold text-white text-lg placeholder:font-normal placeholder:text-slate-600 shadow-inner"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2 relative z-10">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none text-white placeholder:text-slate-600 shadow-inner leading-relaxed"
                        placeholder="Enter transaction details..."
                        required
                    />
                </div>

                {/* Validation Warning */}
                {debitAccountId && creditAccountId && debitAccountId === creditAccountId && (
                    <div className="flex items-center justify-center gap-2 text-rose-300 text-sm font-bold bg-rose-500/10 border border-rose-500/20 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                        Debit and Credit accounts cannot be the same
                    </div>
                )}

                {/* Accounts Selection Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 relative z-10">
                    {/* Debit */}
                    <div className="p-5 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-colors bg-slate-900/30">
                        <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                            Debit Account
                        </label>
                        <div className="relative">
                            <select
                                value={debitAccountId}
                                onChange={(e) => setDebitAccountId(e.target.value)}
                                className="w-full p-4 pr-10 bg-slate-800/80 rounded-xl border border-slate-700/50 focus:border-indigo-500 outline-none appearance-none font-medium text-slate-200 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors"
                                required
                            >
                                <option value="" className="bg-slate-900 text-slate-500">Select Account...</option>
                                <optgroup label="Assets" className="bg-slate-900 text-slate-400 font-bold">
                                    {assetAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                                <optgroup label="Expenses" className="bg-slate-900 text-slate-400 font-bold">
                                    {expenseAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                                <optgroup label="Liabilities" className="bg-slate-900 text-slate-400 font-bold">
                                    {liabilityAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Credit */}
                    <div className="p-5 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-colors bg-slate-900/30">
                        <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
                            Credit Account
                        </label>
                        <div className="relative">
                            <select
                                value={creditAccountId}
                                onChange={(e) => setCreditAccountId(e.target.value)}
                                className="w-full p-4 pr-10 bg-slate-800/80 rounded-xl border border-slate-700/50 focus:border-indigo-500 outline-none appearance-none font-medium text-slate-200 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors"
                                required
                            >
                                <option value="" className="bg-slate-900 text-slate-500">Select Account...</option>
                                <optgroup label="Assets" className="bg-slate-900 text-slate-400 font-bold">
                                    {assetAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                                <optgroup label="Revenue" className="bg-slate-900 text-slate-400 font-bold">
                                    {revenueAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                                <optgroup label="Liabilities" className="bg-slate-900 text-slate-400 font-bold">
                                    {liabilityAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                                <optgroup label="Equity" className="bg-slate-900 text-slate-400 font-bold">
                                    {equityAccounts.map(acc => <option key={acc.id} value={acc.id} className="text-white font-normal">{acc.name}</option>)}
                                </optgroup>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`
                            w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all text-sm uppercase tracking-wider relative overflow-hidden group
                            ${!isFormValid || isSubmitting
                                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-700'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/25 active:scale-[0.99]'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Recording Entry...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2 relative z-10">
                                Post Journal Entry
                                <Check className="w-5 h-5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                            </span>
                        )}
                        {isFormValid && !isSubmitting && (
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JournalEntryForm;
