import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocFromServer, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { isSuperAdmin } from '@/constants';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test connection as required by guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const existingProfile = docSnap.data() as UserProfile;
          // Ensure master admin always has admin role
          if (isSuperAdmin(user.email) && existingProfile.role !== 'admin') {
            const updatedProfile = { ...existingProfile, role: 'admin' as const };
            await setDoc(docRef, updatedProfile);
            setProfile(updatedProfile);
          } else {
            setProfile(existingProfile);
          }
        } else {
          // Check if user was pre-authorized as admin by email
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email?.toLowerCase()), where('role', '==', 'admin'));
          const querySnapshot = await getDocs(q);
          
          let initialRole: 'admin' | 'client' = isSuperAdmin(user.email) ? 'admin' : 'client';
          
          if (!querySnapshot.empty) {
            initialRole = 'admin';
            // Delete the pre-authorized placeholder if it exists with a different ID
            const placeholderDoc = querySnapshot.docs[0];
            if (placeholderDoc.id !== user.uid) {
              // We can't easily delete here without rules, but we can just ignore it
              // and create the new one with the correct UID
            }
          }

          // Create default profile
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            role: initialRole,
            progress: []
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Error signing in:", err);
      setError(err.message || "An unknown error occurred during sign in.");
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError(err.message || "An unknown error occurred during logout.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};
