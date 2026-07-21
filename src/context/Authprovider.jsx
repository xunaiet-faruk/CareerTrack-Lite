/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { createContext } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from '../../firebase';

export const Authcontext = createContext(null);

const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ১. ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ২. ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. গুগল দিয়ে লগইন
  const googleSignIn = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // ৪. লগআউট
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // ৫. প্রোফাইল আপডেট (নাম, ফটো ইত্যাদি)
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    });
  };

  // ৬. ইউজার স্টেট মনিটর করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // ✅ সঠিকভাবে কনসোল লগ করুন
      if (currentUser) {
        console.log("✅ User logged in:", {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          emailVerified: currentUser.emailVerified
        });
        setUser(currentUser);
      } else {
        console.log("❌ No user logged in");
        setUser(null);
      }
      setLoading(false);
    });

    // ক্লিনআপ ফাংশন
    return () => {
      console.log("🔄 Auth listener removed");
      unsubscribe();
    };
  }, []);

  // 🔍 ইউজার স্টেট পরিবর্তন হলে কনসোল লগ
  useEffect(() => {
    if (user) {
      console.log("👤 User state updated:", user.email);
    } else {
      console.log("👤 User state: null");
    }
  }, [user]);

  // 🎯 প্রতিটি অথেন্টিকেশন ফাংশনের জন্য কনসোল লগ
  const createUserWithLog = async (email, password) => {
    console.log("📝 Creating user with email:", email);
    try {
      const result = await createUser(email, password);
      console.log("✅ User created successfully:", result.user.email);
      return result;
    } catch (error) {
      console.error("❌ Create user error:", error.code, error.message);
      throw error;
    }
  };

  const signInUserWithLog = async (email, password) => {
    console.log("🔑 Signing in with email:", email);
    try {
      const result = await signInUser(email, password);
      console.log("✅ User signed in:", result.user.email);
      return result;
    } catch (error) {
      console.error("❌ Sign in error:", error.code, error.message);
      throw error;
    }
  };

  const googleSignInWithLog = async () => {
    console.log("🔵 Google sign in initiated");
    try {
      const result = await googleSignIn();
      console.log("✅ Google sign in successful:", result.user.email);
      return result;
    } catch (error) {
      console.error("❌ Google sign in error:", error.code, error.message);
      throw error;
    }
  };

  const logOutWithLog = async () => {
    console.log("🚪 Logging out...");
    try {
      await logOut();
      console.log("✅ Logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error.code, error.message);
      throw error;
    }
  };

  const authInfo = {
    user,
    loading,
    createUser: createUserWithLog,      // লগ সহ
    signInUser: signInUserWithLog,      // লগ সহ
    googleSignIn: googleSignInWithLog,  // লগ সহ
    logOut: logOutWithLog,              // লগ সহ
    updateUserProfile,
    setUser,
    setLoading
  };

  console.log("🚀 AuthProvider initialized, loading:", loading);

  return (
    <Authcontext.Provider value={authInfo}>
      {children}
    </Authcontext.Provider>
  );
};

export default Authprovider;