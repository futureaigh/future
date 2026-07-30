import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { motion } from 'motion/react';
import { CheckCircle, Mail } from 'lucide-react';

interface LeadFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export const LeadForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<LeadFormData | null>(null);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        data: { ...data },
        recipientEmail: 'futureaigh@gmail.com',
        formType: 'strategy_request',
        status: 'new',
        createdAt: serverTimestamp()
      });
      setLastSubmission(data);
      setIsSuccess(true);
      reset();
    } catch (e) {
      console.error("Error adding lead", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMailClient = () => {
    if (!lastSubmission) return;
    const subject = encodeURIComponent(`Strategy Request from ${lastSubmission.name} (${lastSubmission.company || 'Individual'})`);
    const body = encodeURIComponent(`Name: ${lastSubmission.name}\nEmail: ${lastSubmission.email}\nCompany: ${lastSubmission.company || 'N/A'}\n\nMessage:\n${lastSubmission.message}`);
    window.open(`mailto:futureaigh@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <CheckCircle className="mx-auto text-brand-green mb-4" size={64} />
        <h3 className="text-2xl font-bold mb-2 text-white">Message Received!</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">Your submission has been sent directly to <strong className="text-brand-gold font-mono">futureaigh@gmail.com</strong>. Our team will be in touch within 24 hours.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <button 
            onClick={handleOpenMailClient}
            className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-navy rounded-xl font-bold hover:bg-yellow-400 transition-all text-sm"
          >
            <Mail size={18} />
            Open in Email App
          </button>
          <button 
            onClick={() => setIsSuccess(false)}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-orange outline-none transition-colors"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
            })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-orange outline-none transition-colors"
            placeholder="john@company.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
        <input
          {...register('company')}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-orange outline-none transition-colors"
          placeholder="Acme Corp"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">How can we help?</label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-orange outline-none transition-colors resize-none"
          placeholder="Tell us about your business goals..."
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-bg py-4 rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Submit Strategy Request'}
      </button>
    </form>
  );
};
