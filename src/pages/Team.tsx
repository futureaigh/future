import React from 'react';
import { motion } from 'motion/react';
import { TeamSection } from '../components/TeamSection';
import { usePage } from '../hooks/usePage';
import { Users, Sparkles } from 'lucide-react';

const Team = () => {
  const { page, loading } = usePage('team');

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center text-brand-gold">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-brand-navy">
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Users size={14} />
            <span>Our Leadership & Talent</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight"
          >
            {page?.content?.heroTitle || 'Meet the Minds Behind Future'}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {page?.content?.heroSubtitle || 'A dedicated collective of AI engineers, product strategists and digital architects crafting simplified AI solutions for Africa.'}
          </motion.p>
        </div>
      </section>

      {/* Team Showcase */}
      <TeamSection 
        title={page?.content?.sectionTitle || "Leadership & Innovators"} 
        subtitle={page?.content?.sectionSubtitle || "Passionate professionals committed to driving practical digital transformation across industries."}
      />
    </div>
  );
};

export default Team;
