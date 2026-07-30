import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from '../../firebase';
import { MediaItem } from '../../types';
import { Plus, Trash2, Search, Image as ImageIcon, Upload, X, Copy, Check } from 'lucide-react';

export const MediaLibrary: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem)));
    });
    return unsubscribe;
  }, []);

  const compressImage = (dataUrl: string, maxWidth = 1000, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected for upload:", file?.name);
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select an image under 2MB.");
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          console.log("File read successfully, compressing...");
          const result = reader.result as string;
          const compressed = await compressImage(result, 1000, 0.6);
          console.log("Compression complete, saving to Firestore...");
          const id = doc(collection(db, 'media')).id;
          await setDoc(doc(db, 'media', id), {
            url: compressed,
            name: file.name,
            altText: file.name.split('.')[0],
            uploadedAt: serverTimestamp()
          });
          console.log("Media saved successfully!");
          setUploading(false);
        } catch (error) {
          console.error("Upload Error:", error);
          alert("Error uploading image: " + (error instanceof Error ? error.message : String(error)));
          setUploading(false);
        }
      };
      reader.onerror = () => {
        console.error("FileReader Error");
        alert("Error reading file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Media Library</h1>
          <p className="text-gray-500 text-sm">Store and manage your brand assets securely</p>
        </div>
        <div className="relative">
          <button className={`btn-primary px-8 py-3 flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <div className="w-5 h-5 border-2 border-brand-navy border-t-transparent animate-spin rounded-full"></div> : <Upload size={20} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <input type="file" onChange={handleUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {media.map((item) => (
          <div key={item.id} className="group relative bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-brand-gold/30 transition-all shadow-lg">
            <div className="aspect-square bg-black/20 flex items-center justify-center overflow-hidden">
              <img src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.altText} />
            </div>
            <div className="p-3">
              <p className="text-[10px] text-gray-500 font-bold truncate uppercase tracking-widest">{item.name}</p>
            </div>
            
            <div className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
              <button 
                onClick={() => copyToClipboard(item.url, item.id!)}
                className="flex items-center gap-2 bg-brand-gold text-brand-navy px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
              >
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy URL'}
              </button>
              <button 
                onClick={async () => { if(confirm('Are you sure you want to delete this asset?')) await deleteDoc(doc(db, 'media', item.id!)); }}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-[10px] uppercase mt-2"
              >
                <Trash2 size={12} /> Delete Asset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
