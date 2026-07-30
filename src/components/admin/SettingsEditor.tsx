import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from '../../firebase';
import { SiteSettings } from '../../types';
import { motion } from 'motion/react';
import { Save, Image as ImageIcon, Upload, Globe, MessageCircle, Phone, Mail, Layout, Palette } from 'lucide-react';

export const SettingsEditor: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const fontOptions = [
    { name: 'Inter', value: '"Inter", sans-serif' },
    { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { name: 'Outfit', value: '"Outfit", sans-serif' },
    { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Playfair Display', value: '"Playfair Display", serif' },
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { name: 'Montserrat', value: '"Montserrat", sans-serif' },
    { name: 'Poppins', value: '"Poppins", sans-serif' },
  ];

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) {
        setSettings(snap.data() as SiteSettings);
      } else {
        // Initial defaults
        setSettings({
          brandName: 'Future',
          slogan: 'solutions. simplified.',
          primaryColor: '#131B3D',
          secondaryColor: '#F59E0B',
          headingFont: '"Space Grotesk", sans-serif',
          bodyFont: '"Inter", sans-serif'
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('Global settings updated successfully!');
    } catch (e: any) {
      alert(`Error saving settings: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const compressImage = (dataUrl: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('File too large (>2MB)');
      setUploading(field);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const compressed = await compressImage(result);
        setSettings(prev => prev ? { ...prev, [field]: compressed } : null);
        setUploading(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="max-w-5xl space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-brand-navy/50 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 sticky top-0 z-20">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Site Settings</h1>
          <p className="text-gray-500 text-sm">Global branding and contact configurations</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-8 py-3 flex items-center gap-2 group disabled:opacity-50"
        >
          <Save size={18} className="group-hover:rotate-12 transition-transform" />
          {saving ? 'Saving...' : 'Save Global Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Branding */}
        <section className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Layout className="text-brand-gold" size={24} />
            <h3 className="text-xl font-bold text-white tracking-tight">Identity</h3>
          </div>
          
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Brand Name</label>
              <input 
                value={settings?.brandName}
                onChange={e => setSettings(p => p ? { ...p, brandName: e.target.value } : null)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-gold/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Brand Slogan</label>
              <input 
                value={settings?.slogan}
                onChange={e => setSettings(p => p ? { ...p, slogan: e.target.value } : null)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-gold/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Main Logo</label>
              <ImageUploadField 
                url={settings?.logoMain} 
                onUpload={e => handleImageUpload(e, 'logoMain')}
                uploading={uploading === 'logoMain'}
                label="Primary Brand Logo"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Alt Logo (White)</label>
              <ImageUploadField 
                url={settings?.logoAlt} 
                onUpload={e => handleImageUpload(e, 'logoAlt')}
                uploading={uploading === 'logoAlt'}
                label="Footer/Dark Background Logo"
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Favicon</label>
              <ImageUploadField 
                url={settings?.favicon} 
                onUpload={e => handleImageUpload(e, 'favicon')}
                uploading={uploading === 'favicon'}
                label="Site Icon (32x32)"
              />
            </div>
          </div>

          <div className="pt-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Palette className="text-brand-gold" size={20} />
              <h4 className="font-bold text-white tracking-tight">Typography</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Heading Font</label>
                <div className="space-y-2">
                  <select 
                    value={fontOptions.find(f => f.value === settings?.headingFont) ? settings?.headingFont : 'custom'}
                    onChange={e => {
                      if (e.target.value !== 'custom') {
                        setSettings(p => p ? { ...p, headingFont: e.target.value } : null);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-brand-gold/50 outline-none transition-all"
                  >
                    {fontOptions.map(f => (
                      <option key={f.value} value={f.value} className="bg-brand-navy">{f.name}</option>
                    ))}
                    <option value="custom" className="bg-brand-navy">Other (Type below...)</option>
                  </select>
                  <input 
                    placeholder="e.g. 'Montserrat', sans-serif"
                    value={settings?.headingFont}
                    onChange={e => setSettings(p => p ? { ...p, headingFont: e.target.value } : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-brand-gold/50 outline-none transition-all text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Body Font</label>
                <div className="space-y-2">
                  <select 
                    value={fontOptions.find(f => f.value === settings?.bodyFont) ? settings?.bodyFont : 'custom'}
                    onChange={e => {
                      if (e.target.value !== 'custom') {
                        setSettings(p => p ? { ...p, bodyFont: e.target.value } : null);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-brand-gold/50 outline-none transition-all"
                  >
                    {fontOptions.map(f => (
                      <option key={f.value} value={f.value} className="bg-brand-navy">{f.name}</option>
                    ))}
                    <option value="custom" className="bg-brand-navy">Other (Type below...)</option>
                  </select>
                  <input 
                    placeholder="e.g. 'Inter', sans-serif"
                    value={settings?.bodyFont}
                    onChange={e => setSettings(p => p ? { ...p, bodyFont: e.target.value } : null)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-brand-gold/50 outline-none transition-all text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Social */}
        <section className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold text-white tracking-tight">Connectivity</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <Mail className="text-gray-500" size={20} />
              <input 
                placeholder="Support Email"
                value={settings?.contactEmail}
                onChange={e => setSettings(p => p ? { ...p, contactEmail: e.target.value } : null)}
                className="bg-transparent border-none p-0 flex-grow text-white focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <Phone className="text-gray-500" size={20} />
              <input 
                placeholder="Phone Number"
                value={settings?.contactPhone}
                onChange={e => setSettings(p => p ? { ...p, contactPhone: e.target.value } : null)}
                className="bg-transparent border-none p-0 flex-grow text-white focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <MessageCircle className="text-green-500" size={20} />
              <input 
                placeholder="WhatsApp Number (International format)"
                value={settings?.whatsappNumber}
                onChange={e => setSettings(p => p ? { ...p, whatsappNumber: e.target.value } : null)}
                className="bg-transparent border-none p-0 flex-grow text-white focus:ring-0"
              />
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Color Palette</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <input 
                  type="color" 
                  value={settings?.primaryColor} 
                  onChange={e => setSettings(p => p ? { ...p, primaryColor: e.target.value } : null)}
                  className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-400">{settings?.primaryColor}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <input 
                  type="color" 
                  value={settings?.secondaryColor} 
                  onChange={e => setSettings(p => p ? { ...p, secondaryColor: e.target.value } : null)}
                  className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-400">{settings?.secondaryColor}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ImageUploadField = ({ url, onUpload, uploading, label }: { url?: string; onUpload: (e: any) => void; uploading: boolean; label: string }) => (
  <div className="relative group/upload">
    <div className={`w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-4 transition-all duration-300 overflow-hidden ${url ? 'border-none' : 'hover:border-brand-gold/30 hover:bg-brand-gold/5'}`}>
      {url ? (
        <img src={url} className="w-full h-full object-contain" alt="Preview" />
      ) : (
        <>
          <Upload className="text-gray-600 mb-2" size={24} />
          <span className="text-[10px] text-gray-500 text-center font-bold tracking-tight">{label}</span>
        </>
      )}
      <input type="file" onChange={onUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
      {uploading && (
        <div className="absolute inset-0 bg-brand-navy/80 flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div>
        </div>
      )}
      {url && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="text-white" size={32} />
        </div>
      )}
    </div>
  </div>
);
