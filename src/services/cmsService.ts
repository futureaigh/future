import { collection, doc, getDoc, onSnapshot, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings, NavLink, Page, Testimonial, Product, Service, TrainingProgram } from '../types';

export const getSiteSettings = (callback: (settings: SiteSettings) => void) => {
  return onSnapshot(doc(db, 'settings', 'global'), (doc) => {
    if (doc.exists()) callback(doc.data() as SiteSettings);
  });
};

export const getNavigation = (location: 'header' | 'footer', callback: (links: NavLink[]) => void) => {
  const q = query(
    collection(db, 'navigation'), 
    where('location', '==', location),
    where('isVisible', '==', true),
    orderBy('order', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NavLink)));
  });
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const q = query(collection(db, 'pages'), where('slug', '==', slug), where('status', '==', 'published'));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Page;
};

export const getTestimonials = (callback: (items: Testimonial[]) => void) => {
  const q = query(collection(db, 'testimonials'), where('isVisible', '==', true), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
  });
};

export const getProducts = (callback: (items: Product[]) => void) => {
  const q = query(collection(db, 'products'), where('status', '==', 'active'), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
  });
};

export const getServices = (callback: (items: Service[]) => void) => {
  const q = query(collection(db, 'services'), where('status', '==', 'active'), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
  });
};

export const getTraining = (callback: (items: TrainingProgram[]) => void) => {
  const q = query(collection(db, 'training'), where('status', '==', 'active'), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingProgram)));
  });
};
