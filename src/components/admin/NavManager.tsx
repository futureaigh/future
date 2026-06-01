import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { NavLink as NavItem } from '../../types';
import { Plus, Trash2, Edit2, Navigation, Save, X, MoveVertical, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';

export const NavManager: React.FC = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NavItem>>({});

  useEffect(() => {
    const q = query(collection(db, 'navigation'), orderBy('location', 'asc'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setNavItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NavItem)));
    });
    return unsubscribe;
  }, []);

  const handleCreate = async (location: 'header' | 'footer') => {
    const id = doc(collection(db, 'navigation')).id;
    const item: NavItem = {
      label: 'New Link',
      path: '/',
      order: navItems.filter(i => i.location === location).length,
      location,
      isCTA: false,
      isVisible: true
    };
    await setDoc(doc(db, 'navigation', id), item);
    setEditingId(id);
    setEditForm(item);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    await setDoc(doc(db, 'navigation', editingId), editForm, { merge: true });
    setEditingId(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl pb-20">
      <div className="flex justify-between items-center bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Navigation</h1>
          <p className="text-gray-500 text-sm">Control header, footer, and brand CTA links</p>
        </div>
      </div>

      {['header', 'footer'].map((loc) => (
        <section key={loc} className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">{loc} Navigation</h3>
            <button onClick={() => handleCreate(loc as any)} className="text-brand-gold flex items-center gap-1 text-xs font-bold hover:underline">
              <Plus size={14} /> Add {loc} Link
            </button>
          </div>
          <div className="grid gap-3">
            {navItems.filter(i => i.location === loc).map((item) => (
              <div key={item.id} className={`bg-white/5 border rounded-2xl p-4 transition-all ${editingId === item.id ? 'border-brand-gold' : 'border-white/5'}`}>
                {editingId === item.id ? (
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <input value={editForm.label} onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white" placeholder="Label" />
                    <input value={editForm.path} onChange={e => setEditForm(p => ({ ...p, path: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white" placeholder="Path (/about)" />
                    <div className="flex items-center gap-4">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">CTA?</label>
                      <input type="checkbox" checked={editForm.isCTA} onChange={e => setEditForm(p => ({ ...p, isCTA: e.target.checked }))} className="w-5 h-5 accent-brand-gold" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={handleSave} className="p-2 text-brand-gold"><Save size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-gray-500"><X size={18} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg text-gray-500 cursor-move">
                        <MoveVertical size={16} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.label}</span>
                        <span className="text-[10px] text-gray-500 font-mono italic">({item.path})</span>
                        {item.isCTA && <span className="bg-brand-gold text-brand-navy text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">CTA</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={async () => await setDoc(doc(db, 'navigation', item.id!), { isVisible: !item.isVisible }, { merge: true })} className={`p-2 transition-colors ${item.isVisible ? 'text-blue-400' : 'text-gray-600'}`}>{item.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                      <button onClick={() => { setEditingId(item.id!); setEditForm(item); }} className="p-2 text-gray-400 hover:text-brand-gold"><Edit2 size={16} /></button>
                      <button onClick={async () => { if(confirm('Delete?')) await deleteDoc(doc(db, 'navigation', item.id!)); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
