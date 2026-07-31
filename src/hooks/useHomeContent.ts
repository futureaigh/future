import { useState, useEffect } from 'react';
import { db, onSnapshot, collection, query, where, orderBy, doc } from '../firebase';
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
              description: 'Simplified invoicing, expense tracking and inventory management for modern businesses.', 
              tagline: 'Smart Invoicing & Business Management', 
              targetAudience: 'SMEs, Freelancers & Modern Businesses', 
              features: ["Instant Invoice Generation", "Expense Tracking", "Inventory Sync", "Payment Gateway Integration"],
              accessUrl: 'https://myizyflow.com/', demoUrl: '/contact',
              order: 1 
            } as Product,
            { 
              id: 'izypost', 
              name: 'IzyPost', 
              description: 'Plan, create and schedule social media content with AI-driven insights.', 
              tagline: 'AI Social Media Management', 
              targetAudience: 'Content Creators & SMEs', 
              features: ["AI Content Generator", "Multi-Platform Scheduling", "Audience Analytics", "Automated Posting"],
              accessUrl: '/contact', demoUrl: '/contact',
              order: 2 
            } as Product,
            { 
              id: 'izycard', 
              name: 'IzyCard', 
              description: 'Professional digital business cards that sync instantly with contacts.', 
              tagline: 'Smart Business Identification', 
              targetAudience: 'Professionals & Sales Teams', 
              features: ["NFC & QR Code Sync", "Instant Contact Download", "Custom Branding", "Analytics Dashboard"],
              accessUrl: '/contact', demoUrl: '/contact',
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
