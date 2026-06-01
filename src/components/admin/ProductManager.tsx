import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Product } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, ShoppingBag, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
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
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreate = async () => {
    const id = doc(collection(db, 'products')).id;
    const newProduct: Product = {
      name: 'New Product',
      tagline: 'Simple. Effective.',
      description: 'Describe what this product does for the user.',
      features: ['Feature 1', 'Feature 2'],
      targetAudience: 'Small Businesses',
      status: 'hidden',
      order: products.length
    };
    await setDoc(doc(db, 'products', id), newProduct);
    setEditingId(id);
    setEditForm(newProduct);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    await setDoc(doc(db, 'products', editingId), editForm, { merge: true });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl pb-20">
      <div className="flex justify-between items-center bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Products</h1>
          <p className="text-gray-500 text-sm">Manage Future brand products and variants</p>
        </div>
        <button onClick={handleCreate} className="btn-primary px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="grid gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all">
            <div className="p-8 flex items-center gap-8">
              <div className="w-20 h-20 bg-brand-gold rounded-2xl flex items-center justify-center shrink-0">
                <ShoppingBag className="text-brand-navy" size={32} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{product.name}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                    {product.status}
                  </span>
                </div>
                <p className="text-brand-gold/60 text-sm italic">{product.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingId(product.id!); setEditForm(product); }} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-all">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(product.id!)} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingId === product.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-black/20 border-t border-white/5 overflow-hidden">
                  <div className="p-10 space-y-10">
                    <div className="grid md:grid-cols-3 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Product Media</label>
                           <div className="relative group/upload aspect-square rounded-3xl border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                              {editForm.image ? (
                                <img src={editForm.image} className="w-full h-full object-contain p-4" alt="Product" />
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="mx-auto text-gray-600 mb-2" size={32} />
                                  <span className="text-[10px] text-gray-500 font-bold uppercase">Click to Upload</span>
                                </div>
                              )}
                              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                              {uploading && (
                                <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center backdrop-blur-sm">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div>
                                </div>
                              )}
                              {editForm.image && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="flex flex-col items-center gap-2">
                                     <Upload className="text-white" size={32} />
                                     <span className="text-[10px] text-white font-bold uppercase">Replace Image</span>
                                  </div>
                                </div>
                              )}
                           </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Product Name</label>
                          <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white focus:border-brand-gold/50 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Tagline</label>
                          <input value={editForm.tagline} onChange={e => setEditForm(p => ({ ...p, tagline: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white focus:border-brand-gold/50 outline-none" />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Target Audience</label>
                          <input value={editForm.targetAudience} onChange={e => setEditForm(p => ({ ...p, targetAudience: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white focus:border-brand-gold/50 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Full Description</label>
                          <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={8} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-white focus:border-brand-gold/50 outline-none resize-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Key Features</label>
                      <div className="grid grid-cols-2 gap-3">
                        {editForm.features?.map((f, i) => (
                          <div key={i} className="flex gap-2">
                            <input value={f} onChange={e => {
                              const newFeatures = [...(editForm.features || [])];
                              newFeatures[i] = e.target.value;
                              setEditForm(p => ({ ...p, features: newFeatures }));
                            }} className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
                            <button onClick={() => setEditForm(p => ({ ...p, features: p.features?.filter((_, idx) => idx !== i) }))} className="p-2 text-gray-500 hover:text-red-500"><X size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => setEditForm(p => ({ ...p, features: [...(p.features || []), 'New Feature'] }))} className="text-xs text-brand-gold flex items-center justify-center border-2 border-dashed border-white/5 py-2 rounded-xl hover:bg-white/5">
                          <Plus size={14} className="mr-2" /> Add Feature
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Visibility:</label>
                        <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value as any }))} className="bg-white/10 border-none rounded-xl px-4 py-2 text-sm text-white outline-none">
                          <option value="active">Active (Visible)</option>
                          <option value="hidden">Hidden (Draft)</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setEditingId(null)} className="px-6 py-2 text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={handleSave} className="flex items-center gap-2 bg-brand-gold text-brand-navy px-8 py-3 rounded-2xl font-bold hover:shadow-2xl hover:shadow-brand-gold/20 transition-all">
                          <Save size={20} /> Finish Product
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
