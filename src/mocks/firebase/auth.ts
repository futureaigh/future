export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
  providerData: any[];
}

let currentUser: User | null = null;
const listeners: ((user: User | null) => void)[] = [];

// Try to restore user session from localStorage
try {
  const storedUser = localStorage.getItem('mock_firebase_user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error('Failed to parse stored mock user', e);
}

export function getAuth(app?: any) {
  return {
    get currentUser() {
      return currentUser;
    }
  };
}

export class GoogleAuthProvider {
  static PROVIDER_ID = 'google.com';
}

export async function signInWithPopup(authInstance: any, provider: any) {
  currentUser = {
    uid: 'mock-admin-uid-123',
    email: 'palmersarkodee@gmail.com',
    displayName: 'Mock Administrator',
    photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    emailVerified: true,
    isAnonymous: false,
    tenantId: null,
    providerData: []
  };
  localStorage.setItem('mock_firebase_user', JSON.stringify(currentUser));
  
  // Trigger listeners
  listeners.forEach(cb => cb(currentUser));
  return { user: currentUser };
}

export async function signOut(authInstance: any) {
  currentUser = null;
  localStorage.removeItem('mock_firebase_user');
  listeners.forEach(cb => cb(null));
}

export function onAuthStateChanged(authInstance: any, callback: (user: User | null) => void) {
  listeners.push(callback);
  // Trigger callback asynchronously with current user state
  setTimeout(() => {
    callback(currentUser);
  }, 0);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}
