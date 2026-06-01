import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Target, Lightbulb, Users } from 'lucide-react';
import { usePage } from '../hooks/usePage';

const About = () => {
  const { page, loading } = usePage('about');
  const content = page?.content || {};

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div></div>;

  return (
    <div>
      <section className="bg-brand-navy-light text-white py-20">
        <div className="section-padding text-center">
          <h1 className="text-5xl md:text-7xl mb-6">{content.heroHeading || 'Our Story'}</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {content.heroSubtext || 'Making the fast-changing world of AI and technology easier for African businesses and individuals.'}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl mb-8">{content.whyHeading || 'Why We Exist'}</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                {content.whyParagraph1 || 'Future exists to make the fast-changing world of AI and technology easier for African businesses and individuals. We simplify adoption, reduce confusion, and create tools and systems that are practical, affordable, and useful in everyday business.'}
              </p>
              <p>
                {content.whyParagraph2 || 'We believe that for Africa to thrive in the digital age, technology must be accessible. Not just to big corporations, but to every SME, entrepreneur, and student who wants to grow.'}
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-gold/10 p-8 rounded-2xl group hover:bg-brand-gold hover:text-brand-navy transition-all duration-300">
              <Lightbulb className="text-brand-gold group-hover:text-brand-navy mb-4" size={32} />
              <h3 className="font-bold mb-2">{content.val1Title || 'Practical Understanding'}</h3>
              <p className="text-sm opacity-60">{content.val1Text || 'Real-world business solutions.'}</p>
            </div>
            <div className="bg-brand-navy/5 p-8 rounded-2xl group hover:bg-brand-navy hover:text-white transition-all duration-300">
              <Target className="text-brand-navy group-hover:text-brand-gold mb-4" size={32} />
              <h3 className="font-bold mb-2">{content.val2Title || 'Creative Solving'}</h3>
              <p className="text-sm opacity-60">{content.val2Text || 'Thinking beyond the code.'}</p>
            </div>
            <div className="bg-brand-navy/5 p-8 rounded-2xl group hover:bg-brand-navy hover:text-white transition-all duration-300">
              <Users className="text-brand-navy group-hover:text-brand-gold mb-4" size={32} />
              <h3 className="font-bold mb-2">{content.val3Title || 'Training First'}</h3>
              <p className="text-sm opacity-60">{content.val3Text || 'Empowering through knowledge.'}</p>
            </div>
            <div className="bg-brand-gold/10 p-8 rounded-2xl group hover:bg-brand-gold hover:text-brand-navy transition-all duration-300">
              <CheckCircle2 className="text-brand-gold group-hover:text-brand-navy mb-4" size={32} />
              <h3 className="font-bold mb-2">{content.val4Title || 'Ongoing Support'}</h3>
              <p className="text-sm opacity-60">{content.val4Text || 'We grow with you.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl mb-12">{content.bottomHeading || 'Bridging the Tech Gap'}</h2>
            <p className="text-xl text-gray-600 mb-8 italic">
              "{content.bottomQuote || 'Our mission is to ensure that no business in Ghana or across Africa is left behind by the AI revolution. We simplify the complex, so you can focus on what you do best.'}"
            </p>
            <div className="w-20 h-1 bg-brand-gold mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
