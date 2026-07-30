import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, where } from '../../firebase';
import { Service } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Briefcase, Save, X, Lightbulb, CheckCircle, Smartphone, Globe, MessageSquare, Zap, Upload, Image as ImageIcon, Video, Palette, Bot } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';

export const ServiceManager: React.FC<{ category?: 'work' | 'studio' | 'skills' | 'labs' }> = ({ category }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('File too large (>2MB)');
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        try {
          const compressed = await compressImage(result);
          setEditForm(p => ({ ...p, image: compressed }));
        } catch (err) {
          alert('Failed to process image');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const allServices = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(category ? allServices.filter(s => s.category === category) : allServices);
      setLoading(false);
    });
    return unsubscribe;
  }, [category]);

  const icons = [
    { name: 'Globe', icon: <Globe size={16} /> },
    { name: 'MessageSquare', icon: <MessageSquare size={16} /> },
    { name: 'Zap', icon: <Zap size={16} /> },
    { name: 'Lightbulb', icon: <Lightbulb size={16} /> },
    { name: 'Smartphone', icon: <Smartphone size={16} /> },
    { name: 'Briefcase', icon: <Briefcase size={16} /> },
    { name: 'Video', icon: <Video size={16} /> },
    { name: 'Palette', icon: <Palette size={16} /> },
    { name: 'Bot', icon: <Bot size={16} /> },
  ];

  const handleCreate = async () => {
    const id = doc(collection(db, 'services')).id;
    const newService: Service = {
      title: 'New Item',
      description: 'Describe the value prop.',
      outcome: 'Result for the client.',
      icon: 'Briefcase',
      category: category || 'work',
      status: 'hidden',
      order: services.length
    };
    await setDoc(doc(db, 'services', id), newService);
    setEditingId(id);
    setEditForm(newService);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    await setDoc(doc(db, 'services', editingId), editForm, { merge: true });
    setEditingId(null);
  };

  const getTitle = () => {
    switch(category) {
      case 'work': return 'FUTURE WORK Content';
      case 'studio': return 'FUTURE STUDIO Content';
      case 'skills': return 'FUTURE SKILLS Content';
      case 'labs': return 'FUTURE LABS Content';
      default: return 'Division Services';
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter uppercase">{getTitle()}</h1>
          <p className="text-gray-500 text-sm">Manage services/cards for this division</p>
        </div>
        <button onClick={handleCreate} className="btn-primary px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className={`bg-white/5 border rounded-[2rem] p-8 transition-all relative ${editingId === service.id ? 'border-brand-gold ring-1 ring-brand-gold/20' : 'border-white/5 hover:border-white/10'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold">
                {icons.find(i => i.name === service.icon)?.icon || <Briefcase size={24} />}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(service.id!); setEditForm(service); }} className="p-2 text-gray-500 hover:text-brand-gold"><Edit2 size={18} /></button>
                <button onClick={async () => { if(confirm('Delete?')) await deleteDoc(doc(db, 'services', service.id!)); }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>

            {editingId === service.id ? (
              <div className="space-y-4">
                <div className="relative group/service-img aspect-video rounded-xl border border-white/10 overflow-hidden bg-white/5 mb-4">
                   {editForm.image ? (
                     <img src={editForm.image} className="w-full h-full object-cover" alt="Service" />
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <ImageIcon size={24} className="mb-1" />
                        <span className="text-[10px] font-bold">ADD COVER IMAGE</span>
                     </div>
                   )}
                   <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold" placeholder="Title" />
                <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 resize-none" rows={3} placeholder="Description" />
                <input value={editForm.outcome} onChange={e => setEditForm(p => ({ ...p, outcome: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-brand-gold" placeholder="Goal/Benefit (e.g. Save Time)" />
                <div className="flex gap-2">
                  <select value={editForm.icon} onChange={e => setEditForm(p => ({ ...p, icon: e.target.value }))} className="flex-grow bg-[#0B1021] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                    {icons.map(i => <option key={i.name} value={i.name} className="bg-brand-navy">{i.name}</option>)}
                  </select>
                  <button onClick={handleSave} className="bg-brand-gold text-brand-navy font-bold px-4 rounded-xl text-xs">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 px-2">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white tracking-tight">{service.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2 text-brand-gold font-bold text-xs">
                  <CheckCircle size={14} />
                  {service.outcome}
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold border border-white/10">
                  {service.category}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
