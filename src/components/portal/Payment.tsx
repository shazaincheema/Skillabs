import { motion } from 'motion/react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Plus,
  DollarSign,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const transactions = [
  { id: '1', course: 'WSC Coaching', date: 'Mar 12, 2026', amount: 299, status: 'Completed', method: 'Visa •••• 4242' },
  { id: '2', course: 'Coding & Robotics', date: 'Feb 05, 2026', amount: 399, status: 'Completed', method: 'Mastercard •••• 5555' },
  { id: '3', course: 'Public Speaking', date: 'Jan 10, 2026', amount: 199, status: 'Completed', method: 'Visa •••• 4242' },
];

export default function Payment() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Payments & Billing</h1>
          <p className="text-primary/60">Manage your subscriptions, view invoices, and update payment methods.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus size={20} />
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-display font-bold text-primary">Payment Methods</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="p-4 rounded-xl border-2 border-accent bg-accent/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-primary font-bold text-[10px]">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Visa ending in 4242</p>
                  <p className="text-xs text-primary/40">Expires 12/28</p>
                </div>
              </div>
              <div className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={14} />
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 hover:border-accent/30 transition-all flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-primary font-bold text-[10px]">
                  MC
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Mastercard ending in 5555</p>
                  <p className="text-xs text-primary/40">Expires 08/27</p>
                </div>
              </div>
              <button className="text-xs font-bold text-primary/40 hover:text-accent">Set Default</button>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-primary text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xl font-display font-bold mb-6">Billing Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Active Subscriptions</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Next Billing Date</span>
                <span className="font-bold">Apr 12, 2026</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-accent">$698.00</span>
              </div>
            </div>
            <button className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
              Pay Now
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-display font-bold text-primary">Transaction History</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-widest text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50/50 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-primary">{tx.course}</p>
                          <p className="text-xs text-primary/40">{tx.method}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-primary/60">{tx.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-primary">${tx.amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 size={14} />
                          <span className="text-xs font-bold uppercase tracking-wider">{tx.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-primary/40 hover:text-accent transition-all">
                          <Download size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button className="w-full py-3 border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
