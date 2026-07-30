import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from '../../firebase';
import { Testimonial } from '../../types';
import { Plus, Trash2, Edit2, Quote, Save, User as UserIcon, Eye, EyeOff } from 'lucide-react';

export const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    });
    return unsubscribe;
  }, []);

  const handleCreate = async () => {
    const id = doc(collection(db, 'testimonials')).id;
    const item: Testimonial = {
      name: 'Client Name',
      role: 'CEO, Tech Corp',
      content: 'Future transformed our workflow.',
      isVisible: true,
      order: testimonials.length
    };
    await setDoc(doc(db, 'testimonials', id), item);
    setEditingId(id);
    setEditForm(item);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    await setDoc(doc(db, 'testimonials', editingId), editForm, { merge: true });
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl pb-20">
      <div className="flex justify-between items-center bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Testimonials</h1>
          <p className="text-gray-500 text-sm">Client stories and results</p>
        </div>
        <button onClick={handleCreate} className="btn-primary px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="grid gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className={`bg-white/5 border rounded-3xl p-8 transition-all ${editingId === t.id ? 'border-brand-gold ring-1 ring-brand-gold/20' : 'border-white/5 hover:border-white/10'}`}>
            {editingId === t.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold" placeholder="Name" />
                  <input value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400" placeholder="Role/Business" />
                </div>
                <textarea value={editForm.content} onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white italic" rows={3} placeholder="Quote content..." />
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setEditForm(p => ({ ...p, isVisible: !p.isVisible }))} className={`flex items-center gap-2 text-xs font-bold ${editForm.isVisible ? 'text-green-400' : 'text-gray-500'}`}>
                      {editForm.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                      {editForm.isVisible ? 'VISIBLE' : 'HIDDEN'}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Cancel</button>
                    <button onClick={handleSave} className="bg-brand-gold text-brand-navy font-bold px-6 py-2 rounded-xl text-sm">Save</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-6 relative group">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/5">
                  <UserIcon className="text-gray-600" size={32} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{t.name}</h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.role}</span>
                  </div>
                  <p className="text-gray-400 text-sm italic line-clamp-3">"{t.content}"</p>
                  <div className="absolute top-0 right-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
                    <button onClick={() => { setEditingId(t.id!); setEditForm(t); }} className="p-2 text-gray-500 hover:text-brand-gold"><Edit2 size={16} /></button>
                    <button onClick={async () => { if(confirm('Delete?')) await deleteDoc(doc(db, 'testimonials', t.id!)); }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
