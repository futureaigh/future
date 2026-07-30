import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, getDoc } from '../../firebase';
import { Page } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Search, ExternalLink, ShieldCheck, Eye, EyeOff, Globe, Save, ChevronDown, ChevronRight, Layout, Type, Image as ImageIcon, Link as LinkIcon, Star, Upload } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';

const DEFAULT_PAGE_CONTENT: Record<string, Record<string, string>> = {
  home: {
    heroTextLine1: 'Simplified AI',
    heroTextLine2: 'solutions for Africa',
    heroTextLine3: 'Helping businesses and people operate smarter with AI, systems, media, and modern digital tools.',
    heroBtnPrimary: 'Start Growing Smarter',
    heroBtnSecondary: 'Explore Our Work',
    whyHeadingMain: 'Empowering Africa',
    whyHeadingHighlight: 'Intelligence',
    solutionLabel: 'The Solution',
    solutionText: 'Future makes modern tools simple, practical, accessible, and relevant. We bridge the gap between advanced technology and African realities.',
    solutionBtn: 'Read Our Full Story',
    productsHeading: 'The Ecosystem',
    productsSubtext: 'Innovative SaaS solutions building the foundation for the new 24-hour economy.',
    testimonialsHeading: 'Real Results.',
    economyHeadingLine1: 'Built for the',
    economyHeadingLine2: '24-Hour Economy',
    economyText: 'Future helps businesses stay available, responsive, and efficient day and night using smart systems and automation.',
    ctaHeadingLine1: 'Ready to Simplify the',
    ctaHeadingLine2: 'Future of Your Business?',
    ctaBtnPrimary: 'Book a Consultation',
    ctaBtnSecondary: 'Chat on WhatsApp',
  },
  contact: {
    heroHeading: 'Contact Us',
    heroSubtext: "Ready to simplify your business future? We're just a message away.",
    formHeading: 'Get in Touch',
    formSubtext: 'Whether you have a question about our products, need a custom automation system, or want to book AI training for your team, our experts are ready to help.',
  },
  about: {
    heroHeading: 'Our Story',
    heroSubtext: 'Making the fast-changing world of AI and technology easier for African businesses and individuals.',
    whyHeading: 'Why We Exist',
    whyParagraph1: 'Future exists to make the fast-changing world of AI and technology easier for African businesses and individuals. We simplify adoption, reduce confusion, and create tools and systems that are practical, affordable, and useful in everyday business.',
    whyParagraph2: 'We believe that for Africa to thrive in the digital age, technology must be accessible. Not just to big corporations, but to every SME, entrepreneur, and student who wants to grow.',
    val1Title: 'Practical Understanding',
    val1Text: 'Real-world business solutions.',
    val2Title: 'Creative Solving',
    val2Text: 'Thinking beyond the code.',
    val3Title: 'Training First',
    val3Text: 'Empowering through knowledge.',
    val4Title: 'Ongoing Support',
    val4Text: 'We grow with you.',
    bottomHeading: 'Bridging the Tech Gap',
    bottomQuote: 'Our mission is to ensure that no business in Ghana or across Africa is left behind by the AI revolution. We simplify the complex, so you can focus on what you do best.',
  },
  work: {
    heroHeading: 'We build systems that help businesses operate smarter.',
    heroSubtext: 'Helping businesses save time, get more customers, and operate 24/7 with custom digital infrastructure.',
  },
  studio: {
    heroHeading: 'Modern brands are built with intelligence.',
    heroSubtext: 'We combine high-end creative production with smart distribution strategies to make your brand impossible to ignore.',
  },
  labs: {
    heroHeading: 'The Future Labs.',
    heroSubtext: 'Where we build, test, and launch the next generation of African digital products.',
  },
  skills: {
    heroHeading: 'Master the tools of the future.',
    heroSubtext: 'Practical AI and digital skills training for professionals, teams, and students ready to thrive in the new economy.',
  }
};

const CollapsibleSection: React.FC<{ title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 text-white font-bold">
          <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-lg">
            <Icon size={18} />
          </div>
          {title}
        </div>
        {isOpen ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-6 pt-0 space-y-6 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PageManager: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<Page>>({});

  useEffect(() => {
    const q = query(collection(db, 'pages'), orderBy('slug', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Page)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreate = async () => {
    const title = prompt('Enter page title:');
    if (!title) return;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
    // Using slug as ID for better consistency and to avoid duplicates
    await setDoc(doc(db, 'pages', slug), {
      title,
      slug,
      status: 'draft',
      seo: {
        metaTitle: title,
        metaDescription: '',
        noIndex: false
      },
      content: {},
      updatedAt: serverTimestamp()
    });
  };

  const handleEdit = (page: Page) => {
    setEditingId(page.id!);
    setEditForm({ ...page });
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    
    // Cleanup data: remove id and separate content
    const { id, content, ...otherData } = editForm as any;
    const finalContent = content || {};
    
    console.log("Attempting to save page content:", { editingId, finalContent });

    try {
      await setDoc(doc(db, 'pages', editingId), {
        ...otherData,
        content: finalContent,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log("Save successful!");
      alert("Settings saved successfully!");
      setEditingId(null);
    } catch (e: any) {
      console.error("Save Error:", e);
      alert("Error saving: " + e.message);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (['home', 'contact', 'about'].includes(slug)) {
      return alert('Critical system pages cannot be deleted.');
    }
    if (confirm('Are you sure you want to delete this page? This will also remove its SEO configuration.')) {
      await deleteDoc(doc(db, 'pages', id));
    }
  };

  const toggleStatus = async (page: Page) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    await setDoc(doc(db, 'pages', page.id!), { status: newStatus }, { merge: true });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Pages & SEO</h1>
          <p className="text-gray-500 text-sm">Manage site structure, metadata, and visibility</p>
        </div>
        <button onClick={handleCreate} className="btn-primary px-6 py-3 flex items-center gap-2">
          <Plus size={20} /> Create New Page
        </button>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <div key={page.id} className={`bg-white/5 border rounded-3xl overflow-hidden transition-all duration-300 ${editingId === page.id ? 'border-brand-gold ring-1 ring-brand-gold/20' : 'border-white/5 hover:border-white/10'}`}>
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`p-3 rounded-2xl ${page.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                  {page.status === 'published' ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate flex items-center gap-2">
                    {page.title}
                    {page.status === 'draft' && <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest text-gray-500">Draft</span>}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-brand-gold/60 font-mono italic">
                    <Globe size={10} />
                    /{page.slug}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleStatus(page)} className="p-2 text-gray-400 hover:text-white transition-colors" title={page.status === 'published' ? 'Unpublish' : 'Publish'}>
                  {page.status === 'published' ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button onClick={() => handleEdit(page)} className="p-2 text-gray-400 hover:text-brand-gold transition-colors" title="Edit SEO & Content">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(page.id!, page.slug)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete Page">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingId === page.id && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-black/20 border-t border-white/5 overflow-hidden"
                >
                  <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div className="space-y-6 text-sm">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Basic Info</h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-gray-500 text-xs">Page Title</label>
                          <input 
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-gold/30"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-500 text-xs">Slug (URL Path)</label>
                          <input 
                            value={editForm.slug}
                            onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-gold/30"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 text-sm">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">SEO Configuration</h4>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-gray-500 text-xs">Meta Title</label>
                          <input 
                            value={editForm.seo?.metaTitle}
                            onChange={e => setEditForm({ ...editForm, seo: { ...editForm.seo!, metaTitle: e.target.value } })}
                            placeholder="Optimized for search engines"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-gold/30"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-500 text-xs">Meta Description</label>
                          <textarea 
                            value={editForm.seo?.metaDescription}
                            onChange={e => setEditForm({ ...editForm, seo: { ...editForm.seo!, metaDescription: e.target.value } })}
                            rows={3}
                            placeholder="Brief summary for search results..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-gold/30 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Content Editor based on Page Slug */}
                    <div className="md:col-span-2 space-y-4 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-brand-gold capitalize">{page.title} Page Content</h3>
                        <div className="text-[10px] text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-full">Slug: {page.slug}</div>
                      </div>
                      
                      {(() => {
                        const slug = page.slug;
                        const defaults = DEFAULT_PAGE_CONTENT[slug] || {};
                        const currentContent = editForm.content || {};

                        const renderField = (label: string, key: string, type: 'text' | 'textarea' = 'text') => (
                          <div key={key} className="space-y-1">
                            <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                              {label}
                              {!currentContent[key] && <span className="text-brand-gold/40 text-[9px] lowercase font-normal italic">(Using Default)</span>}
                            </label>
                            {type === 'textarea' ? (
                              <textarea 
                                value={currentContent[key] ?? defaults[key] ?? ''}
                                onChange={e => setEditForm(prev => ({ 
                                  ...prev, 
                                  content: { ...prev.content, [key]: e.target.value } 
                                }))}
                                rows={3}
                                placeholder={defaults[key] || ''}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold/30 transition-all"
                              />
                            ) : (
                              <input 
                                value={currentContent[key] ?? defaults[key] ?? ''}
                                onChange={e => setEditForm(prev => ({ 
                                  ...prev, 
                                  content: { ...prev.content, [key]: e.target.value } 
                                }))}
                                placeholder={defaults[key] || ''}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold/30 transition-all"
                              />
                            )}
                          </div>
                        );

                        if (slug === 'home') {
                          return (
                            <>
                              <CollapsibleSection title="Hero Section" icon={Layout} defaultOpen>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderField('Hero Heading Line 1 (White)', 'heroTextLine1')}
                                  {renderField('Hero Heading Line 2 (Gold)', 'heroTextLine2')}
                                  <div className="md:col-span-2">
                                    {renderField('Hero Subtext', 'heroTextLine3', 'textarea')}
                                  </div>
                                  {renderField('Hero Primary Button', 'heroBtnPrimary')}
                                  {renderField('Hero Secondary Button', 'heroBtnSecondary')}
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="Why & Solution" icon={ShieldCheck}>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderField('Section Heading Main', 'whyHeadingMain')}
                                  {renderField('Section Heading Highlight', 'whyHeadingHighlight')}
                                  {renderField('Solution Box Label', 'solutionLabel')}
                                  {renderField('Solution Button Text', 'solutionBtn')}
                                  <div className="md:col-span-2">
                                    {renderField('Solution Main Text', 'solutionText', 'textarea')}
                                  </div>
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="Products & Ecology" icon={Star}>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderField('Products Heading', 'productsHeading')}
                                  {renderField('Testimonials Heading', 'testimonialsHeading')}
                                  <div className="md:col-span-2">
                                    {renderField('Products Description', 'productsSubtext', 'textarea')}
                                  </div>
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="24-Hour Economy" icon={Type}>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderField('Economy Heading Line 1', 'economyHeadingLine1')}
                                  {renderField('Economy Heading Line 2', 'economyHeadingLine2')}
                                  <div className="md:col-span-2">
                                    {renderField('Economy Description', 'economyText', 'textarea')}
                                  </div>
                                  <div className="md:col-span-2 space-y-2">
                                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest pl-1">Economy Section Image</label>
                                    <div className="relative group/upload aspect-video rounded-3xl border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center max-w-md">
                                      {currentContent.economyImage ? (
                                        <img src={currentContent.economyImage} className="w-full h-full object-cover p-2" alt="Economy" />
                                      ) : (
                                        <div className="text-center">
                                          <ImageIcon className="mx-auto text-gray-600 mb-2" size={32} />
                                          <span className="text-[10px] text-gray-500 font-bold uppercase">Click to Upload Image</span>
                                        </div>
                                      )}
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            if (file.size > 2 * 1024 * 1024) return alert('File too large (>2MB)');
                                            const reader = new FileReader();
                                            reader.onloadend = async () => {
                                              const result = reader.result as string;
                                              try {
                                                const compressed = await compressImage(result);
                                                setEditForm(prev => ({
                                                  ...prev,
                                                  content: { ...prev.content, economyImage: compressed }
                                                }));
                                              } catch (err) {
                                                alert('Failed to process image');
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }} 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="Call to Action (CTA)" icon={LinkIcon}>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderField('CTA Heading Line 1', 'ctaHeadingLine1')}
                                  {renderField('CTA Heading Line 2', 'ctaHeadingLine2')}
                                  {renderField('CTA Primary Button', 'ctaBtnPrimary')}
                                  {renderField('CTA Secondary Button', 'ctaBtnSecondary')}
                                </div>
                              </CollapsibleSection>
                            </>
                          );
                        }

                        if (slug === 'contact') {
                          return (
                            <>
                              <CollapsibleSection title="Hero Section" icon={Layout} defaultOpen>
                                <div className="grid md:grid-cols-1 gap-6">
                                  {renderField('Hero Heading', 'heroHeading')}
                                  {renderField('Hero Subtext', 'heroSubtext', 'textarea')}
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="Contact Form Section" icon={Type}>
                                <div className="grid md:grid-cols-1 gap-6">
                                  {renderField('Form Heading', 'formHeading')}
                                  {renderField('Form Description', 'formSubtext', 'textarea')}
                                </div>
                              </CollapsibleSection>
                            </>
                          );
                        }

                        if (slug === 'about') {
                          return (
                            <>
                              <CollapsibleSection title="Hero & Purpose" icon={Layout} defaultOpen>
                                <div className="grid md:grid-cols-2 gap-6">
                                  {renderField('Hero Heading', 'heroHeading')}
                                  {renderField('Mission Heading', 'whyHeading')}
                                  <div className="md:col-span-2">
                                    {renderField('Hero Subtext', 'heroSubtext', 'textarea')}
                                  </div>
                                  <div className="md:col-span-2">
                                    {renderField('Mission Paragraph 1', 'whyParagraph1', 'textarea')}
                                  </div>
                                  <div className="md:col-span-2">
                                    {renderField('Mission Paragraph 2', 'whyParagraph2', 'textarea')}
                                  </div>
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="Core Values" icon={Star}>
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-brand-gold uppercase">Value 01</span>
                                    {renderField('Title', 'val1Title')}
                                    {renderField('Text', 'val1Text')}
                                  </div>
                                  <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-brand-gold uppercase">Value 02</span>
                                    {renderField('Title', 'val2Title')}
                                    {renderField('Text', 'val2Text')}
                                  </div>
                                  <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-brand-gold uppercase">Value 03</span>
                                    {renderField('Title', 'val3Title')}
                                    {renderField('Text', 'val3Text')}
                                  </div>
                                  <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-brand-gold uppercase">Value 04</span>
                                    {renderField('Title', 'val4Title')}
                                    {renderField('Text', 'val4Text')}
                                  </div>
                                </div>
                              </CollapsibleSection>

                              <CollapsibleSection title="Closing Remarks" icon={Type}>
                                <div className="grid md:grid-cols-1 gap-6">
                                  {renderField('Bottom Heading', 'bottomHeading')}
                                  {renderField('Closing Quote', 'bottomQuote', 'textarea')}
                                </div>
                              </CollapsibleSection>
                            </>
                          );
                        }

                        if (['work', 'studio', 'labs', 'skills'].includes(slug)) {
                          return (
                            <>
                              <CollapsibleSection title="Hero Section" icon={Layout} defaultOpen>
                                <div className="grid md:grid-cols-1 gap-6">
                                  {renderField('Hero Heading', 'heroHeading')}
                                  {renderField('Hero Subtext', 'heroSubtext', 'textarea')}
                                </div>
                              </CollapsibleSection>
                            </>
                          );
                        }

                        // Fallback for other pages
                        return (
                          <div className="p-10 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl col-span-3">
                            <ImageIcon className="mx-auto mb-4 text-gray-500" size={40} />
                            <p className="text-gray-400">Custom content editor for this page is coming soon.</p>
                            <p className="text-xs text-gray-600 mt-2">You can still manage SEO and basic info above.</p>
                          </div>
                        );
                      })()}
                    </div>


                    <div className="md:col-span-2 flex justify-end gap-3 pt-6 pb-4 border-t border-white/5">
                      <button onClick={() => setEditingId(null)} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
                      <button onClick={handleSave} className="flex items-center gap-2 bg-brand-gold text-brand-navy px-10 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-gold/20 hover:-translate-y-0.5 transition-all active:scale-95">
                        <Save size={18} /> Save All Changes
                      </button>
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
