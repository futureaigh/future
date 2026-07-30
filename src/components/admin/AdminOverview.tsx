import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc } from '../../firebase';
import { Analytics, Submission } from '../../types';
import { motion } from 'motion/react';
import { BarChart3, Users, Mail, TrendingUp } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const unsubAnalytics = onSnapshot(doc(db, 'analytics', 'site'), (doc) => {
      if (doc.exists()) setAnalytics(doc.data() as Analytics);
    });
    const unsubSubmissions = onSnapshot(collection(db, 'submissions'), (snap) => {
      setSubmissionsCount(snap.size);
      const sorted = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Submission))
        .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
        .slice(0, 5);
      setRecentSubmissions(sorted);
    });
    return () => { unsubAnalytics(); unsubSubmissions(); };
  }, []);

  const pageData = analytics?.pages ? Object.entries(analytics.pages).map(([name, value]) => ({ name: name.replace(/_/g, '/'), value })) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Overview</h1>
        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}</p>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard label="Total Page Views" value={analytics?.pageViews || 0} icon={<BarChart3 className="text-brand-gold" />} />
        <StatCard label="Unique Visitors" value={analytics?.uniqueVisitors || 0} icon={<Users className="text-blue-400" />} />
        <StatCard label="Total Leads" value={submissionsCount} icon={<Mail className="text-green-400" />} />
        <StatCard label="Engagement Rate" value={`${((submissionsCount / (Number(analytics?.pageViews) || 1)) * 100).toFixed(1)}%`} icon={<TrendingUp className="text-purple-400" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Traffic by Page</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131B3D', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#F59E0B' }}
                />
                <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={4} dot={{ fill: '#F59E0B', strokeWidth: 0, r: 6 }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Recent Leads</h3>
          <div className="space-y-4">
            {recentSubmissions.length > 0 ? recentSubmissions.map((sub) => (
              <div key={sub.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group">
                <div className="font-bold text-white group-hover:text-brand-gold transition-colors truncate">{(sub.data as any).name || 'Anonymous'}</div>
                <div className="text-xs text-gray-500 truncate mb-2">{(sub.data as any).email || 'No email'}</div>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    sub.status === 'new' ? 'bg-brand-gold/20 text-brand-gold' :
                    sub.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {sub.status}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>
              </div>
            )) : <p className="text-gray-500 italic text-center py-20">No recent activity</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: any; icon: any }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-lg hover:border-white/20 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</span>
      <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    <div className="text-4xl font-display font-bold text-white tracking-tighter">{value}</div>
  </div>
);
