// ============================================================
// Self-contained local data store (no Firebase SDK dependencies)
// All data persisted to localStorage under 'mock_firestore_db'
// ============================================================

// ---------------------------------------------------------------------------
// Auth — simple username/password (credentials injected from server env vars)
// ---------------------------------------------------------------------------
export interface User {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
  providerData: any[];
}

let currentUser: User | null = null;
const authListeners: ((user: User | null) => void)[] = [];

try {
  const storedUser = localStorage.getItem('future_admin_session');
  if (storedUser) currentUser = JSON.parse(storedUser);
} catch (e) {
  console.error('Failed to parse stored admin session', e);
}

// Credentials are injected at build time from Railway env vars (see vite.config.ts).
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export function getAuth(app?: any) {
  return {
    get currentUser() { return currentUser; }
  };
}

export async function loginWithPassword(username: string, password: string) {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    currentUser = {
      uid: 'admin-uid-1',
      username: ADMIN_USERNAME,
      email: 'admin@future.ai',
      displayName: 'Administrator',
      photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
      emailVerified: true,
      isAnonymous: false,
      tenantId: null,
      providerData: []
    };
    localStorage.setItem('future_admin_session', JSON.stringify(currentUser));
    authListeners.forEach(cb => cb(currentUser));
    return { user: currentUser };
  }
  throw new Error('Invalid username or password.');
}

export async function signOut(authInstance: any) {
  currentUser = null;
  localStorage.removeItem('future_admin_session');
  authListeners.forEach(cb => cb(null));
}

export function onAuthStateChanged(authInstance: any, callback: (user: User | null) => void) {
  authListeners.push(callback);
  setTimeout(() => { callback(currentUser); }, 0);
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
}

export const auth = getAuth();

// ---------------------------------------------------------------------------
// Firestore — localStorage-backed mock
// ---------------------------------------------------------------------------
const LOCAL_STORAGE_KEY = 'mock_firestore_db';

interface FirestoreDB {
  [collection: string]: { [docId: string]: any };
}

const defaultDB: FirestoreDB = {
  settings: {
    global: {
      brandName: "Future",
      slogan: "Simplified AI Solutions for Africa",
      whatsappNumber: "+233 24 300 5804",
      contactEmail: "futureaigh@gmail.com",
      contactPhone: "+233 24 300 5804",
      contactAddress: "Accra, Ghana",
      primaryColor: "#0A192F",
      secondaryColor: "#F59E0B"
    }
  },
  pages: {
    home: {
      title: "Home", slug: "home", status: "published",
      seo: { metaTitle: "Future | Home", metaDescription: "Empowering Africa through Intelligence and Modern Systems.", noIndex: false },
      content: {
        heroTextLine1: "Simplified AI", heroTextLine2: "solutions for Africa",
        heroTextLine3: "Helping businesses and people operate smarter with AI, systems, media and modern digital tools.",
        heroBtnPrimary: "Start Growing Smarter", heroBtnSecondary: "Explore Our Work",
        whyHeadingMain: "Empowering Africa", whyHeadingHighlight: "Intelligence",
        solutionLabel: "The Solution", solutionText: "Future makes modern tools simple, practical, accessible and relevant. We bridge the gap between advanced technology and African realities.",
        solutionBtn: "Read Our Full Story",
        productsHeading: "The Ecosystem", productsSubtext: "Innovative SaaS solutions building the foundation for the new 24-hour economy.",
        testimonialsHeading: "Real Results.",
        economyHeadingLine1: "Built for the", economyHeadingLine2: "24-Hour Economy",
        economyText: "Future helps businesses stay available, responsive, and efficient day and night using smart systems and automation.",
        economyList: ["Always Accessible", "Fully Automated", "Revenue Focused"],
        ctaHeadingLine1: "Ready to Simplify the", ctaHeadingLine2: "Future of Your Business?",
        ctaBtnPrimary: "Book a Consultation", ctaBtnSecondary: "Chat on WhatsApp"
      },
      updatedAt: new Date().toISOString()
    },
    work: {
      title: "Work", slug: "work", status: "published",
      seo: { metaTitle: "Future | Work", metaDescription: "Systems and automations that help businesses operate smarter.", noIndex: false },
      content: {
        heroHeading: "We build systems that help businesses operate smarter.",
        heroSubtext: "Helping businesses save time, get more customers and operate 24/7 with custom digital infrastructure.",
        benefitsHeading: "Our Goal is Your Growth",
        pricingHeading: "Investment Models",
        pricingSubtext: "Flexible ways to partner with us",
        pricingModels: ["Website Projects", "AI Setup Fees", "Monthly Maintenance", "Automation Retainers", "Hosting/Support"],
        ctaHeading: "Ready to build your system?",
        ctaBtn: "Book a Free Consultation"
      },
      updatedAt: new Date().toISOString()
    },
    studio: {
      title: "Studio", slug: "studio", status: "published",
      seo: { metaTitle: "Future | Studio", metaDescription: "Media and branding that help brands stand out.", noIndex: false },
      content: {
        heroHeading: "We create media that helps brands stand out.",
        heroSubtext: "Elevating African brands through premium video production, AI-powered visuals, and compelling storytelling.",
        benefitsHeading: "Media with a Mission",
        retainersHeading: "Production Retainers",
        retainersSubtext: "Scalable creative output for your brand",
        ctaHeading: "Ready to stand out?",
        ctaBtn: "Start a Creative Project"
      },
      updatedAt: new Date().toISOString()
    },
    skills: {
      title: "Skills", slug: "skills", status: "published",
      seo: { metaTitle: "Future | Skills", metaDescription: "Practical AI and digital skills training.", noIndex: false },
      content: {
        heroHeading: "We teach people and businesses how to use modern tools.",
        heroSubtext: "Empowering the next generation of African professionals with practical AI and digital skills that deliver real-world value.",
        benefitsHeading: "Why Learn with Future?",
        learningHeading: "Learning Paths",
        learningSubtext: "Choose the format that works for you",
        ctaHeading: "Start your learning journey",
        ctaBtn: "Enquire About Training"
      },
      updatedAt: new Date().toISOString()
    },
    labs: {
      title: "Labs", slug: "labs", status: "published",
      seo: { metaTitle: "Future | Labs", metaDescription: "Products and experiments for the future.", noIndex: false },
      content: {
        heroHeading: "We build products and experiment with future ideas.",
        heroSubtext: "Solving African business problems through scalable digital products and innovative experiments.",
        productsHeading: "Featured Labs Products",
        businessHeading: "Our Business Model",
        ctaHeading: "Invest in the Future",
        ctaBtnText: "Partner with Labs"
      },
      updatedAt: new Date().toISOString()
    },
    about: {
      title: "About", slug: "about", status: "published",
      seo: { metaTitle: "Future | About", metaDescription: "Making the fast-changing world of AI and technology easier for African businesses.", noIndex: false },
      content: {
        heroHeading: "Our Story", heroSubtext: "Making the fast-changing world of AI and technology easier for African businesses and individuals.",
        whyHeading: "Why We Exist",
        whyParagraph1: "Future exists to make the fast-changing world of AI and technology easier for African businesses and individuals. We simplify adoption, reduce confusion and create tools and systems that are practical, affordable and useful in everyday business.",
        whyParagraph2: "We believe that for Africa to thrive in the digital age, technology must be accessible. Not just to big corporations, but to every SME, entrepreneur, and student who wants to grow.",
        val1Title: "Practical Understanding", val1Text: "Real-world business solutions.",
        val2Title: "Creative Solving", val2Text: "Thinking beyond the code.",
        val3Title: "Training First", val3Text: "Empowering through knowledge.",
        val4Title: "Ongoing Support", val4Text: "We grow with you.",
        bottomHeading: "Bridging the Tech Gap",
        bottomQuote: "Our mission is to ensure that no business in Ghana or across Africa is left behind by the AI revolution. We simplify the complex, so you can focus on what you do best."
      },
      updatedAt: new Date().toISOString()
    },
    team: {
      title: "Team", slug: "team", status: "published",
      seo: { metaTitle: "Future | Team", metaDescription: "Meet the minds behind Future.", noIndex: false },
      content: {
        heroTitle: "Meet the Minds Behind Future",
        heroSubtitle: "A dedicated collective of AI engineers, product strategists and digital architects crafting simplified AI solutions for Africa.",
        sectionTitle: "Leadership & Innovators",
        sectionSubtitle: "Passionate professionals committed to driving practical digital transformation across industries."
      },
      updatedAt: new Date().toISOString()
    },
    contact: {
      title: "Contact", slug: "contact", status: "published",
      seo: { metaTitle: "Future | Contact", metaDescription: "Get in touch with Future.", noIndex: false },
      content: {
        heroHeading: "Contact Us",
        heroSubtext: "Ready to simplify your business future? We're just a message away.",
        formHeading: "Get in Touch",
        formSubtext: "Whether you have a question about our products, need a custom automation system or want to book AI training for your team, our experts are ready to help.",
        emailLabel: "Email Us",
        phoneLabel: "Call Us",
        visitLabel: "Visit Us"
      },
      updatedAt: new Date().toISOString()
    }
  },
  products: {
    izyflow: { name: "IzyFlow", tagline: "Smart Invoicing & Business Management", description: "Simplified invoicing, expense tracking and inventory management for modern businesses.", features: ["Instant Invoice Generation", "Expense Tracking", "Inventory Sync", "Payment Gateway Integration"], targetAudience: "SMEs, Freelancers & Modern Businesses", accessUrl: "https://myizyflow.com/", demoUrl: "/contact", status: "active", order: 1 },
    izypost: { name: "IzyPost", tagline: "AI Social Media Management", description: "Plan, create and schedule social media content with AI-driven insights.", features: ["AI Content Generator", "Multi-Platform Scheduling", "Audience Analytics", "Automated Posting"], targetAudience: "Content Creators & SMEs", accessUrl: "/contact", demoUrl: "/contact", status: "active", order: 2 },
    izycard: { name: "IzyCard", tagline: "Smart Business Identification", description: "Professional digital business cards that sync instantly with contacts.", features: ["NFC & QR Code Sync", "Instant Contact Download", "Custom Branding", "Analytics Dashboard"], targetAudience: "Professionals & Sales Teams", accessUrl: "/contact", demoUrl: "/contact", status: "active", order: 3 }
  },
  services: {
    w1: { title: "Websites & Web Apps", description: "High-converting, responsive websites and web applications tailored for modern businesses.", outcome: "SAVE TIME & CONVERT LEADS", icon: "Globe", category: "work", status: "active", order: 1 },
    w2: { title: "AI Automations", description: "Automated customer support, lead routing, and intelligent business workflow integrations.", outcome: "24/7 UNINTERRUPTED SUPPORT", icon: "Cpu", category: "work", status: "active", order: 2 },
    w3: { title: "CRM & Lead Systems", description: "Custom customer relationship management, deal tracking, and automated sales funnels.", outcome: "INCREASE CONVERSION BY 35%", icon: "Database", category: "work", status: "active", order: 3 },
    w4: { title: "Digital Infrastructure", description: "Robust cloud deployment, secure database management, and scalable API architecture.", outcome: "ZERO DOWNTIME RELIABILITY", icon: "Construction", category: "work", status: "active", order: 4 },
    st1: { title: "Video Production", description: "High-impact brand documentaries, product commercials, and corporate video storytelling.", outcome: "STAND OUT INSTANTLY", icon: "Video", category: "studio", status: "active", order: 1 },
    st2: { title: "Motion Graphics & AI Visuals", description: "Dynamic 2D/3D animations, AI-assisted video editing and modern visual effects.", outcome: "CAPTURE 10X ATTENTION", icon: "Layers", category: "studio", status: "active", order: 2 },
    st3: { title: "Social Media Creatives", description: "Short-form reels, viral social media templates, and high-conversion campaign assets.", outcome: "VIRAL BRAND REACH", icon: "Share2", category: "studio", status: "active", order: 3 },
    st4: { title: "Brand Identity Design", description: "Complete visual identity systems, brand books, typography pairings, and logo design.", outcome: "PREMIUM MARKET POSITIONING", icon: "Palette", category: "studio", status: "active", order: 4 },
    sk1: { title: "AI Training for Teams", description: "Hands-on workshops teaching corporate teams how to use generative AI for daily business productivity.", outcome: "CUT HOURS OF MANUAL WORK", icon: "Bot", category: "skills", status: "active", order: 1 },
    sk2: { title: "Digital Marketing & Social Media", description: "Practical masterclasses on performance marketing, audience growth, and automated content engines.", outcome: "GENERATE CONSISTENT LEADS", icon: "Share2", category: "skills", status: "active", order: 2 },
    sk3: { title: "Web & No-Code Systems", description: "Empowering non-technical founders to build, launch, and manage modern web platforms.", outcome: "FULL DIGITAL INDEPENDENCE", icon: "Layout", category: "skills", status: "active", order: 3 },
    sk4: { title: "Corporate Executive Briefings", description: "High-level strategic briefings on emerging tech trends, AI compliance, and digital transformation.", outcome: "FUTURE-PROOF LEADERSHIP", icon: "Briefcase", category: "skills", status: "active", order: 4 },
    l1: { title: "AI Apps", description: "Pioneering new ways to bridge the technology gap for African users.", icon: "Bot", category: "labs", status: "active", order: 1 },
    l2: { title: "SaaS Products", description: "Pioneering new ways to bridge the technology gap for African users.", icon: "Rocket", category: "labs", status: "active", order: 2 },
    l3: { title: "Internal Tools", description: "Pioneering new ways to bridge the technology gap for African users.", icon: "Layout", category: "labs", status: "active", order: 3 },
    l4: { title: "Automation Products", description: "Pioneering new ways to bridge the technology gap for African users.", icon: "Zap", category: "labs", status: "active", order: 4 },
    l5: { title: "African Digital Products", description: "Pioneering new ways to bridge the technology gap for African users.", icon: "Globe", category: "labs", status: "active", order: 5 },
    l6: { title: "White-label Platforms", description: "Pioneering new ways to bridge the technology gap for African users.", icon: "ShieldCheck", category: "labs", status: "active", order: 6 }
  },
  testimonials: {
    t1: { name: "Ekow Mensah", role: "Managing Director, EM Agency", content: "The AI training was a game changer for my team. We went from struggling with basic tools to automating half of our reporting in just two days.", isVisible: true, order: 1 }
  },
  team: {
    m1: { name: "Palmer Sarkodee Jnr.", position: "Founder & CEO", bio: "Palmer is the visionary behind Future (formerly Noko-Fine Space), leading the company's strategy, innovation and AI-powered business transformation initiatives. A creative director, filmmaker, AI consultant and business solutions strategist, he specializes in designing practical systems that help African businesses automate operations, improve customer experiences and scale through technology. A graduate in Film Editing from NAFTI/UniMAC and former SRC President, Palmer has collaborated with respected industry leaders including Talal Fattal, Kwaku Sintim-Misa (KSM), Albert & Comfort Ocran, Bessa Simons and Hanna Atiase. At Future, he combines creative thinking, business strategy and emerging technologies to build solutions that make AI simple, practical and accessible for businesses across Africa.", order: 0, isVisible: true },
    m2: { name: "Philip Kofi Marfo", position: "Digital Marketing Lead", bio: "Philip is a digital marketing strategist with expertise in experiential marketing, social media, paid advertising, SEO, analytics and customer acquisition. Before joining Future, he contributed to campaigns and digital growth initiatives at Twitchouse Marketing Services, working with leading brands including MTN, Coca-Cola, Tampico, Dettol, Indomie, Boomplay and Graphic NewsPlus. At Future, Philip leads marketing strategy, brand growth, and audience engagement, helping businesses build meaningful customer connections and achieve measurable results through creative, data-driven campaigns.", order: 1, isVisible: true },
    m3: { name: "Samuel D. Ankapong", position: "Systems & Development Lead", bio: "Samuel leads the technical development and implementation of Future's digital solutions, transforming business ideas into secure, scalable and user-friendly platforms. He specializes in software development, web applications, automation, AI-powered workflows and digital infrastructure, ensuring every solution is built for performance, reliability and long-term growth. At Future, Samuel oversees the architecture and development of business systems, websites and innovative products such as IzyFlow, IzyPost and Future's growing ecosystem of AI-powered solutions. His focus is building technology that simplifies operations and helps African businesses scale with confidence. He holds a BSc. in Biomedical Engineering from the University of Ghana.", order: 2, isVisible: true }
  },
  navigation: {
    nav1: { label: "Home", path: "/", order: 1, location: "header", isCTA: false, isVisible: true },
    nav2: { label: "Work", path: "/work", order: 2, location: "header", isCTA: false, isVisible: true },
    nav3: { label: "Studio", path: "/studio", order: 3, location: "header", isCTA: false, isVisible: true },
    nav4: { label: "Skills", path: "/skills", order: 4, location: "header", isCTA: false, isVisible: true },
    nav5: { label: "Labs", path: "/labs", order: 5, location: "header", isCTA: false, isVisible: true },
    nav6: { label: "About", path: "/about", order: 6, location: "header", isCTA: false, isVisible: true },
    nav7: { label: "Team", path: "/team", order: 7, location: "header", isCTA: false, isVisible: true },
    nav8: { label: "Contact", path: "/contact", order: 8, location: "header", isCTA: true, isVisible: true }
  }
};

function getDB(): FirestoreDB {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const dbData = JSON.parse(data);
      if (dbData.settings?.global) {
        let changed = false;
        if (dbData.settings.global.whatsappNumber === "+233000000000") { dbData.settings.global.whatsappNumber = "+233 24 300 5804"; changed = true; }
        if (dbData.settings.global.contactEmail === "hello@future.com") { dbData.settings.global.contactEmail = "futureaigh@gmail.com"; changed = true; }
        if (dbData.settings.global.contactPhone === "+233 00 000 0000") { dbData.settings.global.contactPhone = "+233 24 300 5804"; changed = true; }
        if (changed) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));
      }
      return dbData;
    }
  } catch (e) { console.error('Error loading local db', e); }
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(dbData: FirestoreDB) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));
    triggerListeners();
  } catch (e) { console.error('Error saving local db', e); }
}

const snapshotListeners: (() => void)[] = [];
function triggerListeners() { snapshotListeners.forEach(cb => cb()); }

export function getFirestore(app?: any, databaseId?: string) {
  return { type: 'firestore' };
}

export function doc(db: any, collectionName: string, docId?: string): any;
export function doc(collectionRef: any): any;
export function doc(collectionRef: any, docId: string): any;
export function doc(dbOrCollectionRef: any, collectionNameOrDocId?: string, docId?: string): any {
  if (dbOrCollectionRef && dbOrCollectionRef.type === 'collection') {
    return { type: 'doc', collection: dbOrCollectionRef.name, id: collectionNameOrDocId || Math.random().toString(36).substring(2, 15) };
  }
  return { type: 'doc', collection: collectionNameOrDocId || '', id: docId || Math.random().toString(36).substring(2, 15) };
}

export function collection(db: any, collectionName: string) {
  return { type: 'collection', name: collectionName };
}

export function query(collectionRef: any, ...constraints: any[]) {
  return { type: 'query', collection: collectionRef.name, constraints };
}

export function where(field: string, op: string, value: any) {
  return { type: 'where', field, op, value };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
  return { type: 'orderBy', field, direction };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

export function increment(value: number) {
  return { type: 'increment', value };
}

export class DocumentSnapshot {
  constructor(public id: string, private existsStatus: boolean, private docData: any) {}
  exists() { return this.existsStatus; }
  data() { return this.docData; }
}

export class QuerySnapshot {
  constructor(public docs: DocumentSnapshot[]) {}
  get empty() { return this.docs.length === 0; }
}

export async function getDoc(docRef: any) {
  const dbData = getDB();
  const col = dbData[docRef.collection] || {};
  const data = col[docRef.id];
  return data !== undefined ? new DocumentSnapshot(docRef.id, true, data) : new DocumentSnapshot(docRef.id, false, null);
}

export async function getDocFromServer(docRef: any) { return getDoc(docRef); }

function executeQuery(queryRef: any): DocumentSnapshot[] {
  const dbData = getDB();
  const collectionName = queryRef.collection || queryRef.name;
  const col = dbData[collectionName] || {};
  let docs = Object.keys(col).map(id => ({ id, data: col[id] }));
  if (queryRef.type === 'query' && queryRef.constraints) {
    for (const constraint of queryRef.constraints) {
      if (constraint.type === 'where') {
        const { field, op, value } = constraint;
        docs = docs.filter(d => {
          const val = d.data[field];
          if (op === '==') return val === value;
          if (op === '!=') return val !== value;
          if (op === '>') return val > value;
          if (op === '>=') return val >= value;
          if (op === '<') return val < value;
          if (op === '<=') return val <= value;
          return true;
        });
      }
    }
    const orderBys = queryRef.constraints.filter((c: any) => c.type === 'orderBy');
    if (orderBys.length > 0) {
      const { field, direction } = orderBys[0];
      docs.sort((a, b) => {
        const valA = a.data[field], valB = b.data[field];
        if (valA === undefined) return 1; if (valB === undefined) return -1;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
  return docs.map(d => new DocumentSnapshot(d.id, true, d.data));
}

export async function getDocs(queryRef: any) {
  return new QuerySnapshot(executeQuery(queryRef));
}

function resolveFields(data: any, existingData: any = {}) {
  const resolved = { ...data };
  for (const key of Object.keys(resolved)) {
    const val = resolved[key];
    if (val && typeof val === 'object') {
      if (val.type === 'increment') {
        resolved[key] = (typeof existingData[key] === 'number' ? existingData[key] : 0) + val.value;
      } else if (val.type === 'serverTimestamp') {
        resolved[key] = new Date().toISOString();
      }
    }
  }
  return resolved;
}

export async function setDoc(docRef: any, data: any, options: { merge?: boolean } = {}) {
  const dbData = getDB();
  if (!dbData[docRef.collection]) dbData[docRef.collection] = {};
  const existing = dbData[docRef.collection][docRef.id] || {};
  if (options.merge) {
    dbData[docRef.collection][docRef.id] = { ...existing, ...resolveFields(data, existing) };
  } else {
    dbData[docRef.collection][docRef.id] = resolveFields(data, existing);
  }
  saveDB(dbData);
}

export async function addDoc(collectionRef: any, data: any) {
  const id = Math.random().toString(36).substring(2, 15);
  await setDoc({ type: 'doc', collection: collectionRef.name, id }, data);
  return { id };
}

export async function updateDoc(docRef: any, data: any) {
  await setDoc(docRef, data, { merge: true });
}

export async function deleteDoc(docRef: any) {
  const dbData = getDB();
  if (dbData[docRef.collection] && dbData[docRef.collection][docRef.id]) {
    delete dbData[docRef.collection][docRef.id];
    saveDB(dbData);
  }
}

export function onSnapshot(ref: any, callback: (snapshot: any) => void) {
  const update = async () => {
    if (ref.type === 'doc') { callback(await getDoc(ref)); }
    else { callback(await getDocs(ref)); }
  };
  update();
  const listener = () => { update(); };
  snapshotListeners.push(listener);
  return () => {
    const idx = snapshotListeners.indexOf(listener);
    if (idx !== -1) snapshotListeners.splice(idx, 1);
  };
}

// ---------------------------------------------------------------------------
// Exported instances matching the old firebase.ts shape
// ---------------------------------------------------------------------------
export const db = getFirestore();
export enum OperationType {
  CREATE = 'create', UPDATE = 'update', DELETE = 'delete', LIST = 'list', GET = 'get', WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: { providerId: string; displayName: string | null; email: string | null; photoUrl: string | null; }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Local Store Error: ', JSON.stringify({
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(p => ({
        providerId: p.providerId, displayName: p.displayName, email: p.email, photoUrl: p.photoURL
      })) || []
    },
    operationType,
    path
  }));
}
