import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';
import { TeamMember } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, Twitter, Mail, User as UserIcon, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'default-1',
    name: 'Palmer Sarkodee',
    position: 'Founder & Chief AI Officer',
    bio: 'Leading Future with a vision to democratise practical AI solutions, systems and digital automation across Ghana and Africa.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    email: 'palmer@future.ai',
    order: 0,
    isVisible: true
  },
  {
    id: 'default-2',
    name: 'Ama Serwaa Mensah',
    position: 'Head of Product & Solutions',
    bio: 'Specialist in enterprise system integrations, product strategy and user-focused digital transformation for growing businesses.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    email: 'ama@future.ai',
    order: 1,
    isVisible: true
  },
  {
    id: 'default-3',
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

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showViewAllLink?: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  title = "Meet Our Team",
  subtitle = "The minds driving innovation, practical AI and modern digital tools for businesses across Africa.",
  className = "py-20 bg-brand-navy",
  showViewAllLink = false
}) => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as TeamMember))
        .filter(m => m.isVisible !== false);

      if (items.length > 0) {
        setTeam(items);
      } else {
        setTeam(DEFAULT_TEAM_MEMBERS);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const displayList = team.length > 0 ? team : DEFAULT_TEAM_MEMBERS;

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-widest mb-4"
          >
            People & Talent
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-400 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent animate-spin rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayList.map((member, i) => {
              const isLongBio = (member.bio || '').length > 100;
              return (
                <motion.div
                  key={member.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-brand-gold/40 transition-all group flex flex-col justify-between hover:shadow-2xl hover:shadow-brand-gold/5 hover:-translate-y-1 duration-300"
                >
                  <div>
                    {/* Photo Frame */}
                    <div className="relative mb-6 rounded-2xl overflow-hidden aspect-square bg-brand-navy-light border border-white/10 flex items-center justify-center">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="text-gray-600">
                          <UserIcon size={56} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="px-3 py-1 bg-brand-gold text-brand-navy font-bold text-[11px] uppercase tracking-wider rounded-lg inline-block shadow-md">
                          {member.position}
                        </span>
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-brand-gold transition-colors">
                      {member.name}
                    </h3>

                    {/* Truncated Bio */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 font-normal line-clamp-3">
                      {member.bio}
                    </p>

                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center gap-1.5 text-brand-gold hover:text-white font-bold text-xs tracking-wide uppercase transition-all mb-4 group/btn"
                    >
                      <span>Read Full Bio</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Social Links */}
                  {(member.linkedin || member.twitter || member.email) && (
                    <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-gray-400">
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-white/5 hover:bg-brand-gold hover:text-brand-navy rounded-xl transition-all"
                          title="LinkedIn"
                        >
                          <Linkedin size={16} />
                        </a>
                      )}
                      {member.twitter && (
                        <a 
                          href={member.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 bg-white/5 hover:bg-brand-gold hover:text-brand-navy rounded-xl transition-all"
                          title="Twitter / X"
                        >
                          <Twitter size={16} />
                        </a>
                      )}
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`} 
                          className="p-2 bg-white/5 hover:bg-brand-gold hover:text-brand-navy rounded-xl transition-all"
                          title="Email"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {showViewAllLink && (
          <div className="text-center mt-12">
            <Link 
              to="/team" 
              className="btn-primary px-8 py-3.5 inline-flex items-center gap-2 text-sm font-bold shadow-xl shadow-brand-gold/10"
            >
              <span>Explore All Team Members</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Full Bio Modal Overlay */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-brand-navy border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full z-10 shadow-2xl overflow-hidden my-auto"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-brand-navy-light border border-white/10 shrink-0 shadow-lg">
                  {selectedMember.photo ? (
                    <img src={selectedMember.photo} alt={selectedMember.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold border border-brand-gold/30 font-bold text-xs uppercase tracking-wider rounded-lg inline-block">
                    {selectedMember.position}
                  </span>
                  <h3 className="text-3xl font-bold text-white tracking-tight">{selectedMember.name}</h3>
                  
                  {/* Social Buttons */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-gray-400">
                    {selectedMember.linkedin && (
                      <a 
                        href={selectedMember.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-3 py-1.5 bg-white/5 hover:bg-brand-gold hover:text-brand-navy rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
                      >
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                    {selectedMember.twitter && (
                      <a 
                        href={selectedMember.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-3 py-1.5 bg-white/5 hover:bg-brand-gold hover:text-brand-navy rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
                      >
                        <Twitter size={14} /> Twitter / X
                      </a>
                    )}
                    {selectedMember.email && (
                      <a 
                        href={`mailto:${selectedMember.email}`} 
                        className="px-3 py-1.5 bg-white/5 hover:bg-brand-gold hover:text-brand-navy rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
                      >
                        <Mail size={14} /> Email
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Biography & Profile</h4>
                <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line font-normal">
                  {selectedMember.bio}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="btn-primary px-6 py-2.5 text-xs"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
