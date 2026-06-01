const LOCAL_STORAGE_KEY = 'mock_firestore_db';

// Define schemas and types
interface FirestoreDB {
  [collection: string]: {
    [docId: string]: any;
  };
}

// Initial Data Seeding
const defaultDB: FirestoreDB = {
  settings: {
    global: {
      brandName: "Future",
      slogan: "solutions. simplified.",
      whatsappNumber: "+233 24 300 5804",
      contactEmail: "futureaigh@gmail.com",
      contactPhone: "+233 24 300 5804",
      primaryColor: "#0A192F",
      secondaryColor: "#F59E0B"
    }
  },
  pages: {
    home: {
      title: "Home",
      slug: "home",
      status: "published",
      seo: {
        metaTitle: "Future | Home",
        metaDescription: "Empowering Africa through Intelligence and Modern Systems.",
        noIndex: false
      },
      content: {
        heroTextLine1: "Simplified AI",
        heroTextLine2: "solutions for Africa",
        heroTextLine3: "Helping businesses and people operate smarter with AI, systems, media, and modern digital tools.",
        heroBtnPrimary: "Start Growing Smarter",
        heroBtnSecondary: "Explore Our Work",
        whyHeadingMain: "Empowering Africa",
        whyHeadingHighlight: "Intelligence",
        solutionLabel: "The Solution",
        solutionText: "Future makes modern tools simple, practical, accessible, and relevant. We bridge the gap between advanced technology and African realities.",
        solutionBtn: "Read Our Full Story",
        productsHeading: "The Ecosystem",
        productsSubtext: "Innovative SaaS solutions building the foundation for the new 24-hour economy.",
        testimonialsHeading: "Real Results.",
        economyHeadingLine1: "Built for the",
        economyHeadingLine2: "24-Hour Economy",
        economyText: "Future helps businesses stay available, responsive, and efficient day and night using smart systems and automation.",
        economyList: ["Always Accessible", "Fully Automated", "Revenue Focused"],
        ctaHeadingLine1: "Ready to Simplify the",
        ctaHeadingLine2: "Future of Your Business?",
        ctaBtnPrimary: "Book a Consultation",
        ctaBtnSecondary: "Chat on WhatsApp"
      },
      updatedAt: new Date().toISOString()
    },
    about: {
      title: "About",
      slug: "about",
      status: "published",
      seo: {
        metaTitle: "Future | About",
        metaDescription: "Making the fast-changing world of AI and technology easier for African businesses.",
        noIndex: false
      },
      content: {
        heroHeading: "Our Story",
        heroSubtext: "Making the fast-changing world of AI and technology easier for African businesses and individuals.",
        whyHeading: "Why We Exist",
        whyParagraph1: "Future exists to make the fast-changing world of AI and technology easier for African businesses and individuals. We simplify adoption, reduce confusion, and create tools and systems that are practical, affordable, and useful in everyday business.",
        whyParagraph2: "We believe that for Africa to thrive in the digital age, technology must be accessible. Not just to big corporations, but to every SME, entrepreneur, and student who wants to grow.",
        val1Title: "Practical Understanding",
        val1Text: "Real-world business solutions.",
        val2Title: "Creative Solving",
        val2Text: "Thinking beyond the code.",
        val3Title: "Training First",
        val3Text: "Empowering through knowledge.",
        val4Title: "Ongoing Support",
        val4Text: "We grow with you.",
        bottomHeading: "Bridging the Tech Gap",
        bottomQuote: "Our mission is to ensure that no business in Ghana or across Africa is left behind by the AI revolution. We simplify the complex, so you can focus on what you do best."
      },
      updatedAt: new Date().toISOString()
    }
  },
  products: {
    izyflow: {
      name: "IzyFlow",
      tagline: "The smartest way to manage your business.",
      description: "Take full control of your business finances and operations. From professional invoicing and expense tracking to real-time financial insights, IzyFlow simplifies everything so you can focus on growth.",
      features: ["Invoicing & Estimates", "Expense Tracking", "Financial Reports", "Client Management"],
      targetAudience: "SMEs, Freelancers & Modern Businesses",
      status: "active",
      order: 1
    },
    izypost: {
      name: "IzyPost",
      tagline: "Social Media Management, Simplified.",
      description: "The ultimate social media command center. Plan, create, and schedule your content across all platforms from a single intuitive calendar.",
      features: ["Multi-Platform Scheduling", "Content Calendar", "Analytics Dashboard", "AI Content Assistant"],
      targetAudience: "Content Creators & SMEs",
      status: "active",
      order: 2
    },
    izycard: {
      name: "IzyCard",
      tagline: "Networking for the Digital Age.",
      description: "The intelligent digital business card that works for you. Share your professional identity instantly and manage leads with built-in analytics.",
      features: ["NFC Card Integration", "Custom Design Builder", "Lead Capturing", "Scan Analytics"],
      targetAudience: "Professionals & Sales Teams",
      status: "active",
      order: 3
    }
  },
  services: {
    s1: {
      title: "Automated Systems",
      description: "We build custom software and workflows that automate manual, repetitive business operations, saving you hours of daily labor.",
      outcome: "Save 10+ hours per week per employee",
      icon: "Cpu",
      category: "work",
      status: "active",
      order: 1
    },
    s2: {
      title: "Media Production",
      description: "Sleek, high-quality audio, video, and design that helps your brand stand out in a noisy digital environment.",
      outcome: "Stunning professional brand image",
      icon: "Globe",
      category: "studio",
      status: "active",
      order: 2
    }
  },
  testimonials: {
    t1: {
      name: "Kofi Mensah",
      role: "CEO, TechGhana",
      content: "Future automated our customer onboarding pipeline. What used to take us a full afternoon is now completed instantly by their systems.",
      isVisible: true,
      order: 1
    },
    t2: {
      name: "Ama Serwaa",
      role: "Founder, Serwaa Studio",
      content: "Using IzyPost has doubled our media publishing speed. Outstanding SaaS designed specifically for our local teams.",
      isVisible: true,
      order: 2
    }
  },
  navigation: {
    nav1: { label: "Home", path: "/", order: 1, location: "header", isCTA: false, isVisible: true },
    nav2: { label: "Work", path: "/work", order: 2, location: "header", isCTA: false, isVisible: true },
    nav3: { label: "Studio", path: "/studio", order: 3, location: "header", isCTA: false, isVisible: true },
    nav4: { label: "Skills", path: "/skills", order: 4, location: "header", isCTA: false, isVisible: true },
    nav5: { label: "Labs", path: "/labs", order: 5, location: "header", isCTA: false, isVisible: true },
    nav6: { label: "About", path: "/about", order: 6, location: "header", isCTA: false, isVisible: true },
    nav7: { label: "Contact", path: "/contact", order: 7, location: "header", isCTA: true, isVisible: true }
  }
};

// Local storage management helpers
function getDB(): FirestoreDB {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const dbData = JSON.parse(data);
      // Auto-migrate old default details if they exist in localStorage
      if (dbData.settings?.global) {
        let changed = false;
        if (dbData.settings.global.whatsappNumber === "+233000000000") {
          dbData.settings.global.whatsappNumber = "+233 24 300 5804";
          changed = true;
        }
        if (dbData.settings.global.contactEmail === "hello@future.com") {
          dbData.settings.global.contactEmail = "futureaigh@gmail.com";
          changed = true;
        }
        if (dbData.settings.global.contactPhone === "+233 00 000 0000") {
          dbData.settings.global.contactPhone = "+233 24 300 5804";
          changed = true;
        }
        if (changed) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));
        }
      }
      return dbData;
    }
  } catch (e) {
    console.error('Error loading mock firestore db', e);
  }
  
  // Seed with defaultDB if not initialized
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(dbData: FirestoreDB) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));
    triggerListeners();
  } catch (e) {
    console.error('Error saving mock firestore db', e);
  }
}

const listeners: (() => void)[] = [];
function triggerListeners() {
  listeners.forEach(cb => cb());
}

// Public Mock Firestore API
export function getFirestore(app?: any, databaseId?: string) {
  return { type: 'firestore' };
}

export function doc(db: any, collectionName: string, docId?: string): any;
export function doc(collectionRef: any): any;
export function doc(collectionRef: any, docId: string): any;
export function doc(dbOrCollectionRef: any, collectionNameOrDocId?: string, docId?: string): any {
  if (dbOrCollectionRef && dbOrCollectionRef.type === 'collection') {
    const colName = dbOrCollectionRef.name;
    const finalDocId = collectionNameOrDocId || Math.random().toString(36).substring(2, 15);
    return { type: 'doc', collection: colName, id: finalDocId };
  }
  
  const finalDocId = docId || Math.random().toString(36).substring(2, 15);
  return { type: 'doc', collection: collectionNameOrDocId || '', id: finalDocId };
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
  constructor(
    public id: string,
    private existsStatus: boolean,
    private docData: any
  ) {}

  exists() {
    return this.existsStatus;
  }

  data() {
    return this.docData;
  }
}

export class QuerySnapshot {
  constructor(public docs: DocumentSnapshot[]) {}
  get empty() {
    return this.docs.length === 0;
  }
}

export async function getDoc(docRef: any) {
  const dbData = getDB();
  const col = dbData[docRef.collection] || {};
  const data = col[docRef.id];
  if (data !== undefined) {
    return new DocumentSnapshot(docRef.id, true, data);
  }
  return new DocumentSnapshot(docRef.id, false, null);
}

export async function getDocFromServer(docRef: any) {
  return getDoc(docRef);
}

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
        const valA = a.data[field];
        const valB = b.data[field];
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  return docs.map(d => new DocumentSnapshot(d.id, true, d.data));
}

export async function getDocs(queryRef: any) {
  const docs = executeQuery(queryRef);
  return new QuerySnapshot(docs);
}

function resolveFields(data: any, existingData: any = {}) {
  const resolved = { ...data };
  for (const key of Object.keys(resolved)) {
    const val = resolved[key];
    if (val && typeof val === 'object') {
      if (val.type === 'increment') {
        const base = typeof existingData[key] === 'number' ? existingData[key] : 0;
        resolved[key] = base + val.value;
      } else if (val.type === 'serverTimestamp') {
        resolved[key] = new Date().toISOString();
      }
    }
  }
  return resolved;
}

export async function setDoc(docRef: any, data: any, options: { merge?: boolean } = {}) {
  const dbData = getDB();
  if (!dbData[docRef.collection]) {
    dbData[docRef.collection] = {};
  }
  
  const existing = dbData[docRef.collection][docRef.id] || {};
  let finalData = data;
  if (options.merge) {
    const resolvedNew = resolveFields(data, existing);
    finalData = { ...existing, ...resolvedNew };
  } else {
    finalData = resolveFields(data, existing);
  }
  
  dbData[docRef.collection][docRef.id] = finalData;
  saveDB(dbData);
}

export async function addDoc(collectionRef: any, data: any) {
  const id = Math.random().toString(36).substring(2, 15);
  const docRef = { type: 'doc', collection: collectionRef.name, id };
  await setDoc(docRef, data);
  return docRef;
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
    if (ref.type === 'doc') {
      const snap = await getDoc(ref);
      callback(snap);
    } else {
      const snap = await getDocs(ref);
      callback(snap);
    }
  };
  
  update();
  
  const listener = () => {
    update();
  };
  listeners.push(listener);
  
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  };
}
