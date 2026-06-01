import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Submission } from '../../types';
import { Mail, Clock, CheckCircle2, Trash2, Filter, Search, Download } from 'lucide-react';

export const SubmissionManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filtered = submissions.filter(s => filter === 'all' || s.status === filter);

  const updateStatus = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    await updateDoc(doc(db, 'submissions', id), { status });
  };

  const deleteSubmission = async (id: string) => {
    if (confirm('Delete this submission?')) {
      await deleteDoc(doc(db, 'submissions', id));
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Form Type,Status,Details\n"
      + submissions.map(s => `${s.createdAt?.toDate?.()?.toLocaleDateString() || ''},${s.formType},${s.status},${JSON.stringify(s.data).replace(/,/g, ';')}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "future_leads.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Leads & Submissions</h1>
          <p className="text-gray-500 text-sm">Managing client inquiries and training registrations</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {(['all', 'new', 'contacted', 'closed'] as const).map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-gold text-brand-navy shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={exportData} className="p-3 bg-white/5 border border-white/10 rounded-xl text-brand-gold hover:bg-brand-gold/10 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((sub) => (
          <div key={sub.id} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              sub.status === 'new' ? 'bg-brand-gold/10 text-brand-gold' :
              sub.status === 'contacted' ? 'bg-blue-400/10 text-blue-400' : 'bg-green-400/10 text-green-400'
            }`}>
              <Mail size={24} />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold/60">{sub.formType} Form</span>
                <span className="text-[10px] text-gray-500 font-mono italic">{sub.createdAt?.toDate?.()?.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {Object.entries(sub.data || {}).map(([key, val]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-500 font-bold capitalize">{key}: </span>
                    <span className="text-white">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button onClick={() => updateStatus(sub.id!, 'contacted')} className={`p-3 rounded-2xl transition-all ${sub.status === 'contacted' ? 'bg-blue-400 text-brand-navy shadow-lg shadow-blue-400/20' : 'bg-white/5 text-gray-500 hover:text-blue-400'}`} title="Mark as Contacted"><Clock size={18} /></button>
              <button onClick={() => updateStatus(sub.id!, 'closed')} className={`p-3 rounded-2xl transition-all ${sub.status === 'closed' ? 'bg-green-400 text-brand-navy shadow-lg shadow-green-400/20' : 'bg-white/5 text-gray-500 hover:text-green-400'}`} title="Mark as Resolved"><CheckCircle2 size={18} /></button>
              <button onClick={() => deleteSubmission(sub.id!)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-red-500 transition-all" title="Delete"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-20 text-gray-500 italic">No submissions found matching this filter.</div>}
      </div>
    </div>
  );
};
