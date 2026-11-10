import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithPopup
} from 'firebase/auth';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface SubmissionItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  pricing: string;
  websiteUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  bestFor?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  favorites: Set<string>;
  submissions: SubmissionItem[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (toolSlug: string) => Promise<boolean>;
  isFavorite: (toolSlug: string) => boolean;
  deleteAccountAndData: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // 1. Session listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile document (store ONLY uid, displayName, photoURL - NEVER email in public doc)
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userDocRef,
            {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'Anonymous User',
              photoURL: currentUser.photoURL || '',
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Could not sync user profile in Firestore:', err);
        }
      } else {
        setFavorites(new Set());
        setSubmissions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time favorites subscription for authenticated user
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    const favsCol = collection(db, 'users', user.uid, 'favorites');
    const unsubscribe = onSnapshot(
      favsCol,
      (snapshot) => {
        const nextFavs = new Set<string>();
        snapshot.forEach((docSnap) => {
          nextFavs.add(docSnap.id);
        });
        setFavorites(nextFavs);
      },
      (err) => {
        console.warn('Favorites listener error:', err.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 3. Real-time submissions subscription for authenticated user
  useEffect(() => {
    if (!user) {
      setSubmissions([]);
      return;
    }

    const submissionsCol = collection(db, 'submissions');
    const q = query(submissionsCol, where('ownerUid', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: SubmissionItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || '',
            slug: data.slug || '',
            tagline: data.tagline || '',
            category: data.category || '',
            pricing: data.pricing || 'Free',
            websiteUrl: data.websiteUrl || '',
            status: data.status || 'pending',
            createdAt: data.createdAt || '',
            bestFor: data.bestFor || ''
          });
        });
        setSubmissions(items);
      },
      (err) => {
        console.warn('Submissions listener notice:', err.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Sign In with Google (popup with redirect fallback)
  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      // If popup was blocked by browser or closed before completion, attempt redirect
      if (
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr: any) {
          setAuthError(redirectErr?.message || 'Failed to authenticate via redirect.');
          return;
        }
      }

      if (err?.code === 'auth/popup-closed-by-user') {
        // User voluntarily dismissed popup
        return;
      }

      console.error('Sign-in error:', err);
      setAuthError(err?.message || 'Google sign-in was unable to complete. Please try again.');
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setFavorites(new Set());
      setSubmissions([]);
    } catch (err: any) {
      console.error('Logout error:', err);
      setAuthError('Could not sign out. Please check your network connection.');
    }
  }, []);

  // Check if tool is favorited
  const isFavorite = useCallback(
    (toolSlug: string) => {
      return favorites.has(toolSlug);
    },
    [favorites]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (toolSlug: string): Promise<boolean> => {
      if (!user) {
        // Prompt sign in
        await signInWithGoogle();
        return false;
      }

      const favDocRef = doc(db, 'users', user.uid, 'favorites', toolSlug);
      const isAlreadyFav = favorites.has(toolSlug);

      try {
        if (isAlreadyFav) {
          await deleteDoc(favDocRef);
          return false;
        } else {
          await setDoc(favDocRef, {
            toolSlug,
            addedAt: new Date().toISOString()
          });
          return true;
        }
      } catch (err: any) {
        console.error('Toggle favorite error:', err);
        setAuthError('Could not update favorites. Please try again.');
        return isAlreadyFav;
      }
    },
    [user, favorites, signInWithGoogle]
  );

  // Delete user account & data
  const deleteAccountAndData = useCallback(async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    try {
      // 1. Delete all user favorites subcollection docs
      const favsCol = collection(db, 'users', uid, 'favorites');
      const favSnap = await getDocs(favsCol);
      const favDeletions = favSnap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(favDeletions);

      // 2. Delete user profile doc
      const userDocRef = doc(db, 'users', uid);
      await deleteDoc(userDocRef);

      // 3. Delete Firebase Auth user
      try {
        await deleteUser(auth.currentUser);
      } catch (authErr: any) {
        if (authErr?.code === 'auth/requires-recent-login') {
          // Re-authenticate first
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(auth.currentUser, provider);
          await deleteUser(auth.currentUser);
        } else {
          throw authErr;
        }
      }

      setUser(null);
      setFavorites(new Set());
      setSubmissions([]);
    } catch (err: any) {
      console.error('Account deletion error:', err);
      throw new Error(err?.message || 'Failed to complete account deletion. Please try again.');
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        favorites,
        submissions,
        signInWithGoogle,
        logout,
        toggleFavorite,
        isFavorite,
        deleteAccountAndData,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
