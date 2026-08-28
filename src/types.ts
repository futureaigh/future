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
