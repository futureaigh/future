import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Page, Product, Service, Testimonial } from '../types';

export const useHomeContent = () => {
  const [page, setPage] = useState<Page | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubPage = onSnapshot(doc(db, 'pages', 'home'), (doc) => {
      if (doc.exists()) setPage({ id: doc.id, ...doc.data() } as Page);
    });

    const unsubProducts = onSnapshot(
      query(collection(db, 'products'), orderBy('order', 'asc')),
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        if (data.length === 0) {
          setProducts([
            { 
              id: 'izyflow', 
              name: 'IzyFlow', 
              description: 'Take full control of your business finances and operations. From professional invoicing and expense tracking to real-time financial insights, IzyFlow simplifies everything so you can focus on growth.', 
              tagline: 'The smartest way to manage your business.', 
              targetAudience: 'SMEs, Freelancers & Modern Businesses', 
              order: 1 
            } as Product,
            { 
              id: 'izypost', 
              name: 'IzyPost', 
              description: 'The ultimate social media command center. Plan, create, and schedule your content across all platforms from a single intuitive calendar.', 
              tagline: 'Social Media Management, Simplified.', 
              targetAudience: 'Content Creators & SMEs', 
              order: 2 
            } as Product,
            { 
              id: 'izycard', 
              name: 'IzyCard', 
              description: 'The intelligent digital business card that works for you. Share your professional identity instantly and manage leads with built-in analytics.', 
              tagline: 'Networking for the Digital Age.', 
              targetAudience: 'Professionals & Sales Teams', 
              order: 3 
            } as Product
          ]);
        } else {
          setProducts(data);
        }
      }
    );

    const unsubServices = onSnapshot(
      query(collection(db, 'services'), where('status', '==', 'active'), orderBy('order', 'asc')),
      (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)))
    );

    const unsubTestimonials = onSnapshot(
      query(collection(db, 'testimonials'), where('isVisible', '==', true), orderBy('order', 'asc')),
      (snap) => setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)))
    );

    const checkLoading = () => {
      // Basic check
      setLoading(false);
    };
    checkLoading();

    return () => {
      unsubPage();
      unsubProducts();
      unsubServices();
      unsubTestimonials();
    };
  }, []);

  return { page, products, services, testimonials, loading };
};
