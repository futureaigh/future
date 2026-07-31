import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import { usePage } from '../hooks/usePage';

const Contact = () => {
  const { settings } = useCMS();
  const { page, loading } = usePage('contact');
  const content = page?.content || {};

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div></div>;

  const socialLinks = [
    { Icon: Instagram, url: settings?.socialLinks?.instagram },
    { Icon: Facebook, url: settings?.socialLinks?.facebook },
    { Icon: Linkedin, url: settings?.socialLinks?.linkedin },
    { Icon: Twitter, url: settings?.socialLinks?.twitter },
  ].filter(link => link.url);

  return (
    <div>
      <section className="bg-brand-navy text-white py-20">
        <div className="section-padding text-center">
          <h1 className="text-5xl md:text-7xl mb-6">{content.heroHeading || 'Contact Us'}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {content.heroSubtext || "Ready to simplify your business future? We're just a message away."}
          </p>
        </div>
      </section>

      <section className="section-padding grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl mb-8">{content.formHeading || 'Get in Touch'}</h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            {content.formSubtext || 'Whether you have a question about our products, need a custom automation system, or want to book AI training for your team, our experts are ready to help.'}
          </p>

          <div className="space-y-8 mb-12">
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                 <Mail size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-lg">Email Us</h4>
                 <p className="text-gray-500">{settings?.contactEmail || 'futureaigh@gmail.com'}</p>
               </div>
            </div>
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                 <Phone size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-lg">Call Us</h4>
                 <p className="text-gray-500">{settings?.contactPhone || '+233 24 300 5804'}</p>
               </div>
            </div>
            <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                 <MapPin size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-lg">Visit Us</h4>
                 <p className="text-gray-500">{settings?.contactAddress || 'Accra, Ghana'}</p>
               </div>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex gap-4">
               {socialLinks.map(({ Icon, url }, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
                    <Icon size={20} />
                  </a>
               ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -m-16" />
          <form className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                <input type="email" className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
              <select className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold outline-none transition-all">
                <option>Custom AI Website</option>
                <option>WhatsApp Automation</option>
                <option>AI Training Enquiry</option>
                <option>Product Support</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Message *</label>
              <textarea className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold outline-none transition-all" rows={4} placeholder="How can we help?" />
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Send Message
              <Send size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-center text-sm text-gray-400 mb-4 font-bold uppercase tracking-widest">Or Reach out directly</p>
            <a 
              href={`https://wa.me/${settings?.whatsappNumber?.replace(/[\+\s\-\(\)]/g, '') || '233000000000'}`} 
              className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold hover:bg-[#25D366]/20 transition-all"
            >
              <MessageCircle size={24} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="section-padding pt-0">
        <div className="w-full h-96 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 flex-col gap-4 border border-dashed border-gray-300 overflow-hidden">
             <>
               <MapPin size={48} />
               <p className="font-bold">Google Map (Accra, Ghana)</p>
             </>
        </div>
      </section>
    </div>
  );
};

export default Contact;
