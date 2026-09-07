export interface SiteContentRecord {
  id: string;
  section_key: string;
  content: any;
  updated_at: any;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest: 'attend_event' | 'volunteer' | 'scholarship' | 'financial_support' | 'partnership' | 'other';
  message?: string;
  created_date: any;
}

export interface AdminUser {
  id: string;
  email: string;
  user_id: string;
}

export interface GalleryImage {
  id: number;
  s3_key: string;
  url: string;
  caption: string;
  sort_order: number;
  visible: boolean;
  width: number | null;
  height: number | null;
  bytes: number | null;
  created_at: string;
}
