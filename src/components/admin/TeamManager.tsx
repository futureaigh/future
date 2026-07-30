import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from '../../firebase';
import { TeamMember, MediaItem } from '../../types';
import { ImageUploadInput } from './ImageUploadInput';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  User as UserIcon, 
  Save, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const TeamManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTeamMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
    });
    return unsubscribe;
  }, []);

  const handleCreate = async () => {
    const id = doc(collection(db, 'team')).id;
    const newMember: TeamMember = {
      name: 'New Team Member',
      position: 'Role / Title',
      bio: 'Share background, expertise, and contribution to the mission here.',
      photo: '',
      linkedin: '',
      twitter: '',
      email: '',
      order: teamMembers.length,
      isVisible: true
    };
    await setDoc(doc(db, 'team', id), newMember);
    setEditingId(id);
    setEditForm(newMember);
  };

  const handleSeedDefaults = async () => {
    if (teamMembers.length > 0) {
      if (!confirm('This will add sample team members to your current list. Continue?')) return;
    }

    const samples: Omit<TeamMember, 'id'>[] = [
      {
        name: 'Palmer Sarkodee',
        position: 'Founder & Chief AI Officer',
        bio: 'Leading Future with a vision to democratize practical AI solutions, systems, and digital automation across Ghana and Africa.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        email: 'palmer@future.ai',
        order: 0,
        isVisible: true
      },
      {
        name: 'Ama Serwaa Mensah',
        position: 'Head of Product & Solutions',
        bio: 'Specialist in enterprise system integrations, product strategy, and user-focused digital transformation for growing businesses.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        email: 'ama@future.ai',
        order: 1,
        isVisible: true
      },
      {
        name: 'Kofi Owusu',
        position: 'Lead AI & Automation Engineer',
        bio: 'Engineers resilient AI workflows, custom chatbot architectures, and automated media & data processing pipelines.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        email: 'kofi@future.ai',
        order: 2,
        isVisible: true
      }
    ];

    for (let i = 0; i < samples.length; i++) {
      const id = doc(collection(db, 'team')).id;
      await setDoc(doc(db, 'team', id), { ...samples[i], order: teamMembers.length + i });
    }
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    try {
      await setDoc(doc(db, 'team', editingId), editForm, { merge: true });
      alert('Team member saved successfully!');
      setEditingId(null);
    } catch (e: any) {
      console.error("Error saving team member:", e);
      alert("Error saving: " + e.message);
    }
  };

  const handleMoveOrder = async (member: TeamMember, direction: 'up' | 'down') => {
    const currentIndex = teamMembers.findIndex(m => m.id === member.id);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= teamMembers.length) return;

    await handleSetOrderPosition(member, targetIndex);
  };

  const handleSetOrderPosition = async (member: TeamMember, newPositionIndex: number) => {
    if (!member.id) return;
    if (newPositionIndex < 0 || newPositionIndex >= teamMembers.length) return;

    const remaining = teamMembers.filter(m => m.id !== member.id);
    remaining.splice(newPositionIndex, 0, member);

    try {
      await Promise.all(
        remaining.map((m, idx) => {
          if (!m.id) return Promise.resolve();
          return setDoc(doc(db, 'team', m.id), { order: idx }, { merge: true });
        })
      );
    } catch (err) {
      console.error("Error updating team order:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-navy p-6 rounded-3xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">Team Members</h1>
          <p className="text-gray-400 text-sm mt-1">Upload photos, manage positions, and edit bios for your team</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {teamMembers.length === 0 && (
            <button 
              onClick={handleSeedDefaults} 
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-brand-gold text-xs font-bold rounded-xl flex items-center gap-2 border border-brand-gold/30 transition-all"
            >
              <Sparkles size={16} /> Seed Sample Team
            </button>
          )}
          <button onClick={handleCreate} className="btn-primary px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus size={20} /> Add Member
          </button>
        </div>
      </div>

      {/* Team Member Cards */}
      {teamMembers.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl p-12 text-center">
          <UserIcon size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Team Members Yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Add team member profiles to showcase the people driving your vision.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={handleCreate} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
              <Plus size={16} /> Create First Member
            </button>
            <button onClick={handleSeedDefaults} className="px-6 py-2.5 bg-white/10 text-brand-gold text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-white/15">
              <Sparkles size={16} /> Add Sample Profiles
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {teamMembers.map((m, index) => (
            <div 
              key={m.id} 
              className={`bg-white/5 border rounded-3xl p-6 lg:p-8 transition-all ${
                editingId === m.id 
                  ? 'border-brand-gold ring-1 ring-brand-gold/30 bg-brand-navy-light/60' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              {editingId === m.id ? (
                /* Edit Mode */
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2">
                      <Edit2 size={18} /> Editing {m.name || 'Member'}
                    </h3>
                    <button 
                      onClick={() => setEditForm(p => ({ ...p, isVisible: !p.isVisible }))} 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        editForm.isVisible ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {editForm.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      {editForm.isVisible ? 'VISIBLE ON WEBSITE' : 'HIDDEN FROM WEBSITE'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Photo */}
                    <div className="space-y-4">
                      <ImageUploadInput
                        label="Profile Photo"
                        value={editForm.photo || ''}
                        onChange={(url) => setEditForm(p => ({ ...p, photo: url }))}
                        helpText="Upload an image directly from your PC or select one from the Media Library."
                      />
                    </div>

                    {/* Right Column: Name, Position, Bio, Socials */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Full Name
                          </label>
                          <input 
                            type="text" 
                            value={editForm.name || ''} 
                            onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold focus:border-brand-gold focus:outline-none"
                            placeholder="e.g. Dr. Kwame Mensah"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Position / Role
                          </label>
                          <input 
                            type="text" 
                            value={editForm.position || ''} 
                            onChange={e => setEditForm(p => ({ ...p, position: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-medium focus:border-brand-gold focus:outline-none"
                            placeholder="e.g. Chief AI Officer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Display Rank / Position
                          </label>
                          <select
                            value={index}
                            onChange={(e) => {
                              const newIndex = parseInt(e.target.value, 10);
                              handleSetOrderPosition(m, newIndex);
                            }}
                            className="w-full bg-brand-navy-light border border-white/10 rounded-xl px-3 py-2.5 text-brand-gold font-bold focus:border-brand-gold focus:outline-none cursor-pointer"
                          >
                            {teamMembers.map((_, idx) => (
                              <option key={idx} value={idx} className="bg-brand-navy text-white">
                                Position #{idx + 1} {idx === 0 ? '(First)' : idx === teamMembers.length - 1 ? '(Last)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Bio & Details
                        </label>
                        <textarea 
                          value={editForm.bio || ''} 
                          onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 leading-relaxed focus:border-brand-gold focus:outline-none"
                          placeholder="Brief biography, background, expertise, and contribution to the mission..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                            LinkedIn URL
                          </label>
                          <input 
                            type="text" 
                            value={editForm.linkedin || ''} 
                            onChange={e => setEditForm(p => ({ ...p, linkedin: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-gold focus:outline-none"
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                            Twitter / X URL
                          </label>
                          <input 
                            type="text" 
                            value={editForm.twitter || ''} 
                            onChange={e => setEditForm(p => ({ ...p, twitter: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-gold focus:outline-none"
                            placeholder="https://x.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                            Email Address
                          </label>
                          <input 
                            type="email" 
                            value={editForm.email || ''} 
                            onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-gold focus:outline-none"
                            placeholder="email@domain.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button 
                      type="button"
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete ${m.name}?`)) {
                          await deleteDoc(doc(db, 'team', m.id!));
                          setEditingId(null);
                        }
                      }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-xs"
                    >
                      <Trash2 size={14} /> Delete Member
                    </button>

                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)} 
                        className="px-5 py-2 text-gray-400 hover:text-white font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={handleSave} 
                        className="bg-brand-gold text-brand-navy font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-brand-gold/20 transition-all"
                      >
                        <Save size={16} /> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Read View Mode */
                <div className="flex flex-col sm:flex-row items-start gap-6 relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative">
                    <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-md text-brand-gold text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-white/10 z-10">
                      #{index + 1}
                    </span>
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-navy-light text-gray-500">
                        <UserIcon size={36} />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-2 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-white text-lg">{m.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            m.isVisible ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {m.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-brand-gold text-xs font-bold tracking-wider uppercase mt-0.5">{m.position}</p>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
                          <span className="text-[11px] text-gray-400 font-semibold">Rank:</span>
                          <select
                            value={index}
                            onChange={(e) => handleSetOrderPosition(m, parseInt(e.target.value, 10))}
                            className="bg-transparent text-brand-gold font-bold text-xs cursor-pointer focus:outline-none"
                            title="Change display order position"
                          >
                            {teamMembers.map((_, idx) => (
                              <option key={idx} value={idx} className="bg-brand-navy text-white">
                                #{idx + 1} {idx === 0 ? '(1st)' : idx === teamMembers.length - 1 ? '(Last)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
                          <button 
                            onClick={() => handleMoveOrder(m, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-300 hover:text-brand-gold disabled:opacity-20 hover:bg-white/10 rounded-lg transition-all"
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            onClick={() => handleMoveOrder(m, 'down')}
                            disabled={index === teamMembers.length - 1}
                            className="p-1.5 text-gray-300 hover:text-brand-gold disabled:opacity-20 hover:bg-white/10 rounded-lg transition-all"
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
                          <button 
                            onClick={() => { setEditingId(m.id!); setEditForm(m); }} 
                            className="p-1.5 text-gray-300 hover:text-brand-gold hover:bg-white/10 rounded-lg transition-all"
                            title="Edit Profile"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={async () => {
                              if (confirm(`Delete ${m.name}?`)) {
                                await deleteDoc(doc(db, 'team', m.id!));
                              }
                            }} 
                            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all"
                            title="Delete Profile"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{m.bio}</p>

                    <div className="flex items-center gap-4 pt-1 text-xs text-gray-400">
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                          LinkedIn
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-400 transition-colors">
                          Twitter
                        </a>
                      )}
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                          {m.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
