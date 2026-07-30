import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, FolderOpen, X, Check } from 'lucide-react';
import { db, collection, query, orderBy, getDocs, doc, setDoc, serverTimestamp } from '../../firebase';
import { MediaItem } from '../../types';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  helpText?: string;
}

const compressImage = (dataUrl: string, maxWidth = 1200, quality = 0.75): Promise<string> => {
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

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Paste image URL or upload from PC...',
  className = '',
  helpText
}) => {
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select an image under 5MB.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const rawResult = reader.result as string;
        const compressed = await compressImage(rawResult, 1200, 0.75);
        onChange(compressed);

        // Also save to Media Library in background
        try {
          const mediaId = doc(collection(db, 'media')).id;
          await setDoc(doc(db, 'media', mediaId), {
            url: compressed,
            name: file.name,
            altText: file.name.split('.')[0],
            uploadedAt: serverTimestamp()
          });
        } catch (err) {
          console.warn('Could not auto-save to media library, but image set:', err);
        }

        setUploading(false);
      } catch (err) {
        console.error('Image compression failed:', err);
        alert('Could not process image file.');
        setUploading(false);
      }
    };

    reader.onerror = () => {
      alert('Failed to read file from PC.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const openLibrary = async () => {
    setShowLibrary(true);
    setLoadingMedia(true);
    try {
      const q = query(collection(db, 'media'), orderBy('uploadedAt', 'desc'));
      const snap = await getDocs(q);
      setMediaList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem)));
    } catch (err) {
      console.error('Failed to load media library:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between">
        <span>{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-red-400 hover:text-red-300 normal-case font-normal text-xs flex items-center gap-1"
          >
            <Trash2 size={12} /> Clear photo
          </button>
        )}
      </label>

      {/* Image Preview Card */}
      {value && (
        <div className="relative group aspect-video max-h-48 w-full bg-black/40 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer bg-brand-gold text-brand-navy px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-yellow-400 transition-colors">
              <Upload size={14} /> Change Photo (PC)
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <button
              type="button"
              onClick={openLibrary}
              className="bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-2 hover:bg-white/30 transition-colors"
            >
              <FolderOpen size={14} /> Media Library
            </button>
          </div>
        </div>
      )}

      {/* Upload Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold pr-10"
          />
          {value && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
              <Check size={16} />
            </span>
          )}
        </div>

        {/* Upload PC Button */}
        <label className={`cursor-pointer bg-brand-gold text-brand-navy px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shrink-0 hover:bg-yellow-400 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Processing PC Photo...
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Upload from PC</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {/* Select from Media Library Button */}
        <button
          type="button"
          onClick={openLibrary}
          className="bg-white/10 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shrink-0 hover:bg-white/20 transition-colors border border-white/10"
          title="Choose from uploaded Media Library"
        >
          <FolderOpen size={16} />
          <span className="hidden sm:inline">Library</span>
        </button>
      </div>

      {helpText && <p className="text-xs text-gray-400">{helpText}</p>}

      {/* Media Library Picker Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-navy border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Image from Media Library</h3>
                <p className="text-xs text-gray-400">Choose a photo previously uploaded to your brand asset storage</p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {loadingMedia ? (
                <div className="flex justify-center py-12">
                  <RefreshCw size={24} className="text-brand-gold animate-spin" />
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No images in library yet.</p>
                  <p className="text-xs text-gray-500 mt-1">Upload an image from your PC using the 'Upload from PC' button!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onChange(item.url);
                        setShowLibrary(false);
                      }}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                        value === item.url ? 'border-brand-gold ring-2 ring-brand-gold' : 'border-white/10 hover:border-brand-gold/50'
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1.5 rounded-lg">Select Photo</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
