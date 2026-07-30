export interface SiteSettings {
  brandName: string;
  slogan: string;
  logoMain?: string;
  logoAlt?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  contactAddress?: string;
  contactHours?: string;
  mapEmbed?: string;
  headingFont?: string;
  bodyFont?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  ga4Id?: string;
}

export interface Page {
  id?: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  content?: any;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    noIndex: boolean;
  };
  updatedAt: any;
}

export interface Section {
  id?: string;
  pageId: string;
  type: 'hero' | 'why-future' | 'products-preview' | 'services' | 'training' | 'economy' | 'choose-us' | 'testimonials' | 'cta' | 'text-image';
  order: number;
  content: any;
  isVisible: boolean;
}

export interface Product {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  targetAudience: string;
  image?: string;
  accessUrl?: string;
  demoUrl?: string;
  status: 'active' | 'hidden';
  order: number;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  outcome: string;
  image?: string;
  icon: string;
  category: 'work' | 'studio' | 'skills' | 'labs';
  status: 'active' | 'hidden';
  order: number;
}

export interface TrainingProgram {
  id?: string;
  title: string;
  description: string;
  icon: string;
  format: string;
  outcome: string;
  status: 'active' | 'hidden';
  order: number;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  photo?: string;
  isVisible: boolean;
  order: number;
}

export interface TeamMember {
  id?: string;
  name: string;
  position: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  order: number;
  isVisible: boolean;
}

export interface Submission {
  id?: string;
  formType: 'contact' | 'consultation' | 'training' | 'waitlist';
  data: any;
  status: 'new' | 'contacted' | 'closed';
  createdAt: any;
}

export interface MediaItem {
  id?: string;
  url: string;
  name: string;
  altText: string;
  category?: string;
  uploadedAt: any;
}

export interface NavLink {
  id?: string;
  label: string;
  path: string;
  order: number;
  location: 'header' | 'footer';
  isCTA: boolean;
  isVisible: boolean;
}

export interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  lastUpdated: any;
  devices?: Record<string, number>;
  pages?: Record<string, number>;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'content' | 'marketing' | 'viewer';
}
