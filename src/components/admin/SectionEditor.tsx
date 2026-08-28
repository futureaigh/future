import { useState, useRef, type ChangeEvent } from 'react';
import { Save, Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SectionEditorProps {
  key?: string;
  sectionKey: string;
  data: any;
  onSave: (content: any) => void;
  isSaving: boolean;
}

export default function SectionEditor({ data, onSave, isSaving }: SectionEditorProps) {
  const [formData, setFormData] = useState(data);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadField, setActiveUploadField] = useState<string | null>(null);

  const lastDataRef = useRef(data);

  // Safely sync with updated database content when parent updates,
  // without resetting the form on every innocent reference change from parent renders.
  if (JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
    setFormData(data);
    lastDataRef.current = data;
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key: string, index: number, field: string, value: any) => {
    const newArray = [...formData[key]];
    newArray[index] = { ...newArray[index], [field]: value };
    handleChange(key, newArray);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, fieldKey: string, index?: number, subField?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fieldId = index !== undefined ? `${fieldKey}-${index}-${subField}` : (subField ? `${fieldKey}--${subField}` : fieldKey);
    setUploading(fieldId);
    setUploadProgress(0);

    try {
      setUploadProgress(30);
      const url = await uploadImage(file);
      setUploadProgress(100);

      let updatedFormData = { ...formData };
      if (index !== undefined && subField) {
        const newArray = [...formData[fieldKey]];
        newArray[index] = { ...newArray[index], [subField]: url };
        updatedFormData = { ...formData, [fieldKey]: newArray };
        handleArrayChange(fieldKey, index, subField, url);
      } else if (subField) {
        const newValue = { ...formData[fieldKey], [subField]: url };
        updatedFormData = { ...formData, [fieldKey]: newValue };
        handleChange(fieldKey, newValue);
      } else {
        updatedFormData = { ...formData, [fieldKey]: url };
        handleChange(fieldKey, url);
      }
      
      toast.success('Image uploaded and synced successfully');
      onSave(updatedFormData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
      setActiveUploadField(null);
      setUploadProgress(0);
    }
  };

  const renderProgressBar = (fieldId: string) => {
    if (uploading !== fieldId) return null;
    return (
      <div className="w-full max-w-md mt-2 mb-2 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            Uploading and Optimizing...
          </span>
          <span className="text-xs font-black text-blue-600 tracking-tight">{uploadProgress}%</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    );
  };

  const renderField = (key: string, value: any, path: string = '', index?: number) => {
    const isImageUrl = key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('ogimage') || key.toLowerCase().includes('favicon');

    if (typeof value === 'string') {
      return (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {key.replace(/_/g, ' ')}
            </label>
            {isImageUrl && (
              <button
                onClick={() => {
                  setActiveUploadField(key);
                  fileInputRef.current?.click();
                }}
                disabled={uploading === key}
                className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                {uploading === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                Upload Image
              </button>
            )}
          </div>
          {isImageUrl && value && (
            <div className="relative group w-24 h-24 mb-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-2">
               <img src={value} className="max-w-full max-h-full object-contain" />
               <button
                onClick={() => handleChange(key, '')}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
               >
                 <X className="w-3 h-3" />
               </button>
            </div>
          )}
          {renderProgressBar(key)}
          {value.length > 80 && !isImageUrl ? (
            <textarea
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[120px] bg-white shadow-sm"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white shadow-sm"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} className="space-y-4">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            {key.replace(/_/g, ' ')}
          </label>
          <div className="space-y-4">
            {value.map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Entry #{idx + 1}</span>
                   <button
                    onClick={() => {
                        const newArray = [...formData[key]];
                        newArray.splice(idx, 1);
                        handleChange(key, newArray);
                    }}
                    className="text-red-400 hover:text-red-500 transition-colors"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>
                {Object.entries(item).map(([field, fieldValue]) => {
                   const isItemImage = field.toLowerCase().includes('image') || field.toLowerCase().includes('url') || field.toLowerCase().includes('logo') || field.toLowerCase().includes('favicon');
                   return (
                    <div key={field} className="space-y-1.5">
                       {renderProgressBar(`${key}-${idx}-${field}`)}
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {field.replace(/_/g, ' ')}
                          </label>
                          {isItemImage && (
                            <button
                              onClick={() => {
                                setActiveUploadField(`${key}-${idx}-${field}`);
                                fileInputRef.current?.click();
                              }}
                              className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:text-blue-700 transition-colors"
                            >
                               {uploading === `${key}-${idx}-${field}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                               Upload
                            </button>
                          )}
                       </div>
                       {isItemImage && fieldValue && (
                        <div className="relative group w-16 h-16 mb-1 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-1">
                           <img src={fieldValue as string} className="max-w-full max-h-full object-contain" />
                           <button
                            onClick={() => handleArrayChange(key, idx, field, '')}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X className="w-2.5 h-2.5" />
                           </button>
                        </div>
                       )}
                       <input
                        type="text"
                        className="w-full px-4 py-2 text-xs border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all bg-gray-50/50"
                        value={fieldValue as string}
                        onChange={(e) => handleArrayChange(key, idx, field, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
            <button
               onClick={() => {
                 const newItem = Object.keys(value[0] || {}).reduce((acc: any, k) => ({ ...acc, [k]: '' }), {});
                 handleChange(key, [...formData[key], newItem]);
               }}
               className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-xs font-bold text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all uppercase tracking-widest"
            >
              + Add New {key.replace(/s$/, '')}
            </button>
          </div>
        </div>
      );
    }
 
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="space-y-4">
           <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            {key.replace(/_/g, ' ')}
          </label>
          <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm">
            {Object.entries(value).map(([subKey, subValue]) => {
              const isSubImage = subKey.toLowerCase().includes('image') || subKey.toLowerCase().includes('url') || subKey.toLowerCase().includes('logo') || subKey.toLowerCase().includes('favicon');
              return (
                <div key={subKey} className="space-y-1.5">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {subKey.replace(/_/g, ' ')}
                    </label>
                    {isSubImage && (
                      <button
                        onClick={() => {
                          setActiveUploadField(`${key}--${subKey}`); // Use double dash for nested objects
                          fileInputRef.current?.click();
                        }}
                        className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:text-blue-700 transition-colors"
                      >
                        {uploading === `${key}--${subKey}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        Upload
                      </button>
                    )}
                   </div>
                   {isSubImage && subValue && (
                    <div className="relative group w-16 h-16 mb-1 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-1">
                       <img src={subValue as string} className="max-w-full max-h-full object-contain" />
                       <button
                        onClick={() => {
                          const newValue = { ...formData[key], [subKey]: '' };
                          handleChange(key, newValue);
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X className="w-2.5 h-2.5" />
                       </button>
                    </div>
                   )}
                  {renderProgressBar(`${key}--${subKey}`)}
                  <input
                    type="text"
                     className="w-full px-4 py-2 text-xs border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all bg-gray-50/50"
                    value={subValue as string}
                    onChange={(e) => {
                      const newValue = { ...formData[key], [subKey]: e.target.value };
                      handleChange(key, newValue);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (activeUploadField) {
            if (activeUploadField.includes('--')) {
              const [key, subField] = activeUploadField.split('--');
              handleFileUpload(e, key, undefined, subField);
            } else if (activeUploadField.includes('-')) {
              const [key, index, field] = activeUploadField.split('-');
              handleFileUpload(e, key, parseInt(index), field);
            } else {
              handleFileUpload(e, activeUploadField);
            }
            // Reset value so selecting the same file triggers change event again
            e.target.value = '';
          }
        }}
      />

      <div className="grid gap-8">
        {Object.entries(formData).map(([key, value]) => renderField(key, value))}
      </div>

      <div className="flex justify-end pt-8 border-t border-gray-100">
        <button
          onClick={() => onSave(formData)}
          disabled={isSaving}
          className={cn(
            "group flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[24px] text-lg font-black tracking-tight transition-all",
            "hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-blue-600/30"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Syncing Changes...
            </>
          ) : (
            <>
              <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Save Section
            </>
          )}
        </button>
      </div>
    </div>
  );
}
