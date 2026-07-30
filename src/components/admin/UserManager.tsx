import React, { useState, useEffect } from 'react';
import { db, collection, query, onSnapshot, doc, setDoc, deleteDoc } from '../../firebase';
import { UserProfile } from '../../types';
import { Shield, Plus, Trash2, User as UserIcon, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = async (uid: string, role: string) => {
    if (confirm(`Change user role to ${role}?`)) {
      await setDoc(doc(db, 'users', uid), { role }, { merge: true });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl pb-20">
      <div className="flex justify-between items-center bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Users & Roles</h1>
          <p className="text-gray-500 text-sm">Control access levels and administrator permissions</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
            <tr>
              <th className="px-8 py-5">Administrator</th>
              <th className="px-8 py-5">Role / Access Level</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.uid} className="group hover:bg-white/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-all">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{user.email}</div>
                      <div className="text-[10px] text-gray-600 font-mono italic uppercase">ID: {user.uid.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <select 
                    value={user.role} 
                    onChange={e => handleRoleChange(user.uid, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-brand-gold/50 cursor-pointer"
                  >
                    <option value="admin">Super Admin (Full)</option>
                    <option value="content">Content Admin (Editor)</option>
                    <option value="marketing">Marketing Admin (SEO/CTA)</option>
                    <option value="viewer">Viewer (Read-only)</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role === 'admin' ? <Shield size={10} /> : <ShieldCheck size={10} />}
                    {user.role}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  {user.email !== 'palmersarkodee@gmail.com' && (
                    <button onClick={async () => { if(confirm('Remove access?')) await deleteDoc(doc(db, 'users', user.uid)); }} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-20 bg-white/5">
            <ShieldAlert className="text-gray-700 mx-auto mb-4" size={48} />
            <p className="text-gray-500 italic max-w-xs mx-auto">No other users have been granted access to this dashboard yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
