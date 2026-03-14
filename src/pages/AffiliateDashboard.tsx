import React from 'react';
import { motion } from 'motion/react';
import { Link, Copy, CheckCircle2, DollarSign, Users, MousePointerClick, TrendingUp, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const AffiliateDashboard = () => {
  const [copied, setCopied] = React.useState(false);
  const referralLink = 'https://digitalempire.com/?ref=johndoe123';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 py-12 flex-1">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Affiliate Dashboard</h1>
            <p className="text-slate-500 mt-1">Track your referrals, earnings, and manage payouts.</p>
          </div>
          <Button variant="gradient" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Withdraw Funds
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Earnings', value: '$1,245.50', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { title: 'Total Sales', value: '45', icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-100' },
            { title: 'Total Clicks', value: '1,204', icon: MousePointerClick, color: 'text-amber-600', bg: 'bg-amber-100' },
            { title: 'Conversion Rate', value: '3.7%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Referral Link Generator */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Your Referral Link</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input 
                    readOnly 
                    value={referralLink} 
                    className="pr-12 bg-slate-50 border-slate-200 text-slate-600 font-mono text-sm h-12"
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <Button className="h-12 px-8 whitespace-nowrap">Generate Custom Link</Button>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                Share this link on your blog, social media, or with friends. You'll earn a 30% commission for every sale made through this link.
              </p>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Referrals</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Product</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Commission</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { date: 'Oct 12, 2023', product: 'React Mastery Course', amount: '$99.00', commission: '$29.70', status: 'Paid' },
                      { date: 'Oct 10, 2023', product: 'SaaS Dashboard UI', amount: '$49.00', commission: '$14.70', status: 'Pending' },
                      { date: 'Oct 08, 2023', product: 'Next.js Boilerplate', amount: '$149.00', commission: '$44.70', status: 'Paid' },
                      { date: 'Oct 05, 2023', product: 'Notion Template', amount: '$19.00', commission: '$5.70', status: 'Paid' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-4 text-slate-600">{row.date}</td>
                        <td className="py-4 font-medium text-slate-900">{row.product}</td>
                        <td className="py-4 text-slate-600">{row.amount}</td>
                        <td className="py-4 font-medium text-emerald-600">{row.commission}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            row.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
              <h3 className="text-lg font-semibold mb-2 relative z-10">Available Balance</h3>
              <p className="text-4xl font-bold mb-6 relative z-10">$450.20</p>
              
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pending</span>
                  <span className="font-medium">$14.70</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Paid</span>
                  <span className="font-medium">$780.60</span>
                </div>
              </div>
              
              <Button variant="gradient" className="w-full mt-8 relative z-10">
                Request Payout
              </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Payout Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-primary-200 bg-primary-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">PayPal</p>
                      <p className="text-xs text-slate-500">john.doe@example.com</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary-600" />
                </div>
                <Button variant="outline" className="w-full text-sm border-dashed">
                  + Add Payment Method
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
