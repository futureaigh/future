import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

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

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        data: { ...data },
        formType: 'contact',
        status: 'new',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      reset();
    } catch (e) {
      console.error("Error adding lead", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <CheckCircle className="mx-auto text-brand-green mb-4" size={64} />
        <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
        <p className="text-gray-400">Our team will be in touch within 24 hours.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-brand-yellow hover:underline"
        >
          Send another message
        </button>
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
