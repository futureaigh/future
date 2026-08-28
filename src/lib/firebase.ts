import { DEFAULT_CONTENT } from './defaultContent';

// Initialize localStorage schemas
if (!localStorage.getItem('ttc_site_content')) {
  localStorage.setItem('ttc_site_content', JSON.stringify([]));
}
if (!localStorage.getItem('ttc_submissions')) {
  localStorage.setItem('ttc_submissions', JSON.stringify([]));
}
if (!localStorage.getItem('ttc_mock_storage')) {
  localStorage.setItem('ttc_mock_storage', JSON.stringify({}));
}

// ----------------------------------------------------
// Authentication Mock
// ----------------------------------------------------

let currentUser: any = null;
const savedUser = localStorage.getItem('ttc_auth_user');
if (savedUser) {
  try {
    currentUser = JSON.parse(savedUser);
  } catch (e) {}
}

const listeners: Array<(user: any) => void> = [];

export const auth = {
  get currentUser() {
    return currentUser;
  }
};

export const googleProvider = {};

export async function login() {
  const email = window.prompt("Enter admin email to sign in:", "nokofinespace@gmail.com");
  if (email) {
    currentUser = {
      uid: 'mock-admin-' + email.replace(/[^a-zA-Z0-9]/g, ''),
      email: email,
      displayName: email.split('@')[0]
    };
    localStorage.setItem('ttc_auth_user', JSON.stringify(currentUser));
    listeners.forEach(cb => cb(currentUser));
    return currentUser;
  }
  throw new Error("Login cancelled");
}

export async function logout() {
  currentUser = null;
  localStorage.removeItem('ttc_auth_user');
  listeners.forEach(cb => cb(currentUser));
}

export function onAuthStateChanged(authInstance: any, callback: (user: any) => void) {
  listeners.push(callback);
  callback(currentUser);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

// ----------------------------------------------------
// Firestore Mock
// ----------------------------------------------------

export const db = {};

export function collection(dbInstance: any, path: string) {
  return {
    collectionName: path
  };
}

export function doc(dbInstance: any, path: string, ...segments: string[]) {
  const fullPath = [path, ...segments].filter(Boolean).join('/');
  const parts = fullPath.split('/');
  return {
    collectionName: parts[0],
    id: parts[1],
    path: fullPath
  };
}

export async function getDocs(collectionRef: any) {
  const dbName = collectionRef.collectionName;
  if (dbName === 'site_content') {
    const list = JSON.parse(localStorage.getItem('ttc_site_content') || '[]');
    return {
      docs: list.map((item: any) => ({
        id: item.id,
        data: () => {
          const docData = { ...item };
          if (docData.updated_at) {
            docData.updated_at = {
              toDate: () => new Date(docData.updated_at)
            };
          }
          return docData;
        }
      }))
    };
  }

  if (dbName === 'submissions') {
    const list = JSON.parse(localStorage.getItem('ttc_submissions') || '[]');
    const sorted = [...list].sort((a: any, b: any) => {
      const tA = a.created_date ? new Date(a.created_date).getTime() : 0;
      const tB = b.created_date ? new Date(b.created_date).getTime() : 0;
      return tB - tA;
    });

    return {
      docs: sorted.map((item: any) => ({
        id: item.id,
        data: () => {
          const docData = { ...item };
          if (docData.created_date) {
            docData.created_date = {
              toDate: () => new Date(docData.created_date)
            };
          }
          return docData;
        }
      }))
    };
  }

  return { docs: [] };
}

export async function getDoc(docRef: any) {
  const dbName = docRef.collectionName;
  const id = docRef.id;

  if (dbName === 'admins') {
    return {
      exists: () => true,
      data: () => ({})
    };
  }

  if (dbName === 'site_content') {
    const list = JSON.parse(localStorage.getItem('ttc_site_content') || '[]');
    const item = list.find((i: any) => i.id === id);
    if (item) {
      return {
        exists: () => true,
        data: () => {
          const docData = { ...item };
          if (docData.updated_at) {
            docData.updated_at = {
              toDate: () => new Date(docData.updated_at)
            };
          }
          return docData;
        }
      };
    }
  }

  return {
    exists: () => false,
    data: () => null
  };
}

export async function addDoc(collectionRef: any, data: any) {
  const dbName = collectionRef.collectionName;
  const generatedId = Math.random().toString(36).substring(2, 15);
  const nowStr = new Date().toISOString();

  const processedData = { ...data };
  Object.keys(processedData).forEach(key => {
    if (processedData[key] && typeof processedData[key] === 'object' && !Array.isArray(processedData[key])) {
      processedData[key] = nowStr;
    }
  });

  if (dbName === 'site_content') {
    const list = JSON.parse(localStorage.getItem('ttc_site_content') || '[]');
    const record = { id: generatedId, ...processedData };
    list.push(record);
    localStorage.setItem('ttc_site_content', JSON.stringify(list));
    return { id: generatedId };
  }

  if (dbName === 'submissions') {
    const list = JSON.parse(localStorage.getItem('ttc_submissions') || '[]');
    const record = { id: generatedId, ...processedData };
    list.push(record);
    localStorage.setItem('ttc_submissions', JSON.stringify(list));
    return { id: generatedId };
  }

  return { id: generatedId };
}

export async function updateDoc(docRef: any, data: any) {
  const dbName = docRef.collectionName;
  const id = docRef.id;
  const nowStr = new Date().toISOString();

  const processedData = { ...data };
  Object.keys(processedData).forEach(key => {
    if (processedData[key] && typeof processedData[key] === 'object' && !Array.isArray(processedData[key])) {
      processedData[key] = nowStr;
    }
  });

  if (dbName === 'site_content') {
    const list = JSON.parse(localStorage.getItem('ttc_site_content') || '[]');
    const updated = list.map((item: any) => {
      if (item.id === id) {
        return { ...item, ...processedData };
      }
      return item;
    });
    localStorage.setItem('ttc_site_content', JSON.stringify(updated));
  }
}

export function query(collectionRef: any, ...constraints: any[]) {
  return collectionRef;
}

export function orderBy(field: string, direction?: 'asc' | 'desc') {
  return { type: 'orderBy', field, direction };
}

export function serverTimestamp() {
  return { _isServerTimestamp: true };
}

// ----------------------------------------------------
// Storage Mock
// ----------------------------------------------------

export const storage = {};

export function ref(storageInstance: any, path: string) {
  return { path };
}

export function uploadBytesResumable(storageRef: any, file: File, metadata?: any) {
  let progressCallback: ((snapshot: any) => void) | null = null;
  let errorCallback: ((error: any) => void) | null = null;
  let successCallback: (() => void) | null = null;
  let isCancelled = false;

  const snapshot = {
    bytesTransferred: 0,
    totalBytes: file.size,
    ref: storageRef
  };

  const runUpload = async () => {
    try {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (isCancelled) reject(new Error('cancelled'));
          else resolve(null);
        }, 100);
      });

      if (isCancelled) return;

      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsDataURL(file);
      });

      const storageMap = JSON.parse(localStorage.getItem('ttc_mock_storage') || '{}');
      storageMap[storageRef.path] = dataUrl;
      localStorage.setItem('ttc_mock_storage', JSON.stringify(storageMap));

      snapshot.bytesTransferred = file.size;
      if (progressCallback) progressCallback(snapshot);
      if (successCallback) successCallback();
    } catch (err) {
      if (errorCallback) errorCallback(err);
    }
  };

  const uploadTask = {
    on(event: string, progress: (snapshot: any) => void, error: (err: any) => void, complete: () => void) {
      progressCallback = progress;
      errorCallback = error;
      successCallback = complete;
      runUpload();
    },
    cancel() {
      isCancelled = true;
    },
    snapshot: {
      ref: storageRef
    }
  };

  return uploadTask;
}

export async function getDownloadURL(storageRef: any) {
  const storageMap = JSON.parse(localStorage.getItem('ttc_mock_storage') || '{}');
  const dataUrl = storageMap[storageRef.path];
  if (dataUrl) return dataUrl;
  throw new Error("File not found in mock storage: " + storageRef.path);
}
