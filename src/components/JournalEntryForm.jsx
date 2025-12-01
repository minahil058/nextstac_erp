import { useState } from 'react';

const JournalEntryForm = ({ onPostEntry, accounts }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [debitAccountId, setDebitAccountId] = useState('');
    const [creditAccountId, setCreditAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Filter accounts by type for easier selection
    const assetAccounts = accounts.filter(a => a.type === 'Asset');
    const liabilityAccounts = accounts.filter(a => a.type === 'Liability');
    const equityAccounts = accounts.filter(a => a.type === 'Equity');
    const revenueAccounts = accounts.filter(a => a.type === 'Revenue');
    const expenseAccounts = accounts.filter(a => a.type === 'Expense');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const entry = {
            date,
            description,
            debit_account_id: debitAccountId, // Use snake_case for DB
            credit_account_id: creditAccountId, // Use snake_case for DB
            amount: parseFloat(amount)
        };

        const success = await onPostEntry(entry);

        setIsSubmitting(false);

        if (success) {
            // Show success message
            setShowSuccess(true);

            // Reset form
            setDescription('');
            setDebitAccountId('');
            setCreditAccountId('');
            setAmount('');

            // Hide success message after 3 seconds
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
        <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/10">
            {/* Success Notification */}
            {showSuccess && (
                <div className="absolute top-0 left-0 w-full bg-success-500 text-white px-6 py-3 flex items-center justify-between animate-in slide-in-from-top duration-300 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Journal Entry Recorded Successfully</span>
                    </div>
                    <button onClick={() => setShowSuccess(false)} className="text-white/80 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date Input */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2 group-focus-within:text-accent-600 transition-colors">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-xl border-primary-200 bg-primary-50/50 shadow-sm focus:border-accent-500 focus:ring-accent-500 focus:ring-2 focus:bg-white transition-all duration-200 p-3 text-primary-900 font-medium"
                            required
                        />
                    </div>

                    {/* Amount Input */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2 group-focus-within:text-accent-600 transition-colors">Amount</label>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="text-primary-400 font-medium text-lg">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="block w-full rounded-xl border-primary-200 bg-primary-50/50 pl-8 pr-12 focus:border-accent-500 focus:ring-accent-500 focus:ring-2 focus:bg-white transition-all duration-200 p-3 text-primary-900 font-bold text-lg placeholder-primary-300"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="group">
                    <label className="block text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2 group-focus-within:text-accent-600 transition-colors">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border-primary-200 bg-primary-50/50 shadow-sm focus:border-accent-500 focus:ring-accent-500 focus:ring-2 focus:bg-white transition-all duration-200 p-3 text-primary-900 font-medium placeholder-primary-300 resize-none"
                        placeholder="Enter transaction details..."
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Debit Account */}
                    <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100 hover:border-accent-200 hover:shadow-md transition-all duration-300 group">
                        <label className="block text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-500 group-hover:scale-125 transition-transform duration-300"></span>
                            Debit Account
                        </label>
                        <select
                            value={debitAccountId}
                            onChange={(e) => setDebitAccountId(e.target.value)}
                            className="w-full rounded-xl border-primary-200 shadow-sm focus:border-accent-500 focus:ring-accent-500 focus:ring-2 p-3 bg-white text-primary-900 font-medium cursor-pointer"
                            required
                        >
                            <option value="">Select Account...</option>
                            <optgroup label="Assets">
                                {assetAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Expenses">
                                {expenseAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Liabilities">
                                {liabilityAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Equity">
                                {equityAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Revenue">
                                {revenueAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                        </select>
                    </div>

                    {/* Credit Account */}
                    <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100 hover:border-accent-200 hover:shadow-md transition-all duration-300 group">
                        <label className="block text-sm font-bold text-primary-700 mb-3 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-400 group-hover:bg-accent-400 group-hover:scale-125 transition-all duration-300"></span>
                            Credit Account
                        </label>
                        <select
                            value={creditAccountId}
                            onChange={(e) => setCreditAccountId(e.target.value)}
                            className="w-full rounded-xl border-primary-200 shadow-sm focus:border-accent-500 focus:ring-accent-500 focus:ring-2 p-3 bg-white text-primary-900 font-medium cursor-pointer"
                            required
                        >
                            <option value="">Select Account...</option>
                            <optgroup label="Assets">
                                {assetAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Liabilities">
                                {liabilityAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Equity">
                                {equityAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Revenue">
                                {revenueAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                            <optgroup label="Expenses">
                                {expenseAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </optgroup>
                        </select>
                    </div>

                    {/* Validation Warning */}
                    {debitAccountId && creditAccountId && debitAccountId === creditAccountId && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-50 text-red-600 px-6 py-3 rounded-full text-xs font-bold shadow-lg border border-red-100 z-10 flex items-center gap-2 animate-bounce">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Debit and Credit accounts cannot be the same
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className={`
              px-8 py-4 rounded-xl text-white font-bold shadow-lg shadow-accent-500/30 focus:outline-none focus:ring-4 focus:ring-accent-500/50 transition-all duration-300
              ${!isFormValid || isSubmitting
                                ? 'bg-primary-300 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-500/40'
                            }
            `}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Post Journal Entry'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JournalEntryForm;
