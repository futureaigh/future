import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { TrainingProgram } from '../../types';
import { Plus, Trash2, Edit2, GraduationCap, Save, X, Book, Video, Layout, Rocket } from 'lucide-react';

export const TrainingManager: React.FC = () => {
  const [training, setTraining] = useState<TrainingProgram[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TrainingProgram>>({});

  useEffect(() => {
    const q = query(collection(db, 'training'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTraining(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingProgram)));
    });
    return unsubscribe;
  }, []);

  const handleCreate = async () => {
    const id = doc(collection(db, 'training')).id;
    const item: TrainingProgram = {
      title: 'AI Masterclass',
      description: 'Hands-on training.',
      icon: 'Book',
      format: 'In-person / Online',
      outcome: 'Certification & Skills',
      status: 'hidden',
      order: training.length
    };
    await setDoc(doc(db, 'training', id), item);
    setEditingId(id);
    setEditForm(item);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    await setDoc(doc(db, 'training', editingId), editForm, { merge: true });
    setEditingId(null);
  };

  const icons = [
    { name: 'Book', icon: <Book size={16} /> },
    { name: 'Video', icon: <Video size={16} /> },
    { name: 'Layout', icon: <Layout size={16} /> },
    { name: 'Rocket', icon: <Rocket size={16} /> },
    { name: 'GraduationCap', icon: <GraduationCap size={16} /> }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">AI Training Programs</h1>
          <p className="text-gray-500 text-sm">Empowering Africa with future-ready skills</p>
        </div>
        <button onClick={handleCreate} className="btn-primary px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Add Program
        </button>
      </div>

      <div className="grid gap-6">
        {training.map((item) => (
          <div key={item.id} className={`bg-white/5 border rounded-3xl p-6 transition-all ${editingId === item.id ? 'border-brand-gold ring-1 ring-brand-gold/20' : 'border-white/5 hover:border-white/10'}`}>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-gold text-brand-navy rounded-2xl flex items-center justify-center shrink-0">
                {icons.find(i => i.name === item.icon)?.icon || <GraduationCap size={32} />}
              </div>
              
              <div className="flex-grow">
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold" />
                      <select value={editForm.icon} onChange={e => setEditForm(p => ({ ...p, icon: e.target.value }))} className="w-full bg-white/10 rounded-xl px-3 py-2 text-white">
                        {icons.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                      </select>
                    </div>
                    <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400" rows={2} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input value={editForm.format} onChange={e => setEditForm(p => ({ ...p, format: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="Format (e.g. Online)" />
                      <input value={editForm.outcome} onChange={e => setEditForm(p => ({ ...p, outcome: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="Skill Outcome" />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">Cancel</button>
                      <button onClick={handleSave} className="bg-brand-gold text-brand-navy font-bold px-6 py-2 rounded-xl text-sm">Save Program</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] text-brand-gold uppercase font-bold bg-brand-gold/10 px-2 py-0.5 rounded-full">{item.format}</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{item.outcome}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(item.id!); setEditForm(item); }} className="p-2 text-gray-500 hover:text-white"><Edit2 size={18} /></button>
                      <button onClick={async () => { if(confirm('Delete?')) await deleteDoc(doc(db, 'training', item.id!)); }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
