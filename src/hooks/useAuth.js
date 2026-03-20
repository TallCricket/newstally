// src/hooks/useAuth.js
import { useState } from 'react'
import {
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

export function useAuth(showToast, closeAuth) {

  const [authError, setAuthError] = useState('')

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      // Create Firestore user doc if new
      const uRef = doc(db, 'users', user.uid)
      const snap = await getDoc(uRef).catch(() => null)
      if (!snap || !snap.exists()) {
        const uname = (user.email || '').split('@')[0].replace(/[^a-z0-9_]/gi, '').toLowerCase()
        await setDoc(uRef, {
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          email: user.email || '',
          username: uname,
          followersCount: 0, followingCount: 0,
          followers: [], following: [], bookmarks: [], savedPosts: []
        }).catch(() => {})
      }
      showToast('Signed in! Welcome 🎉')
      closeAuth()
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') showToast('Google sign-in failed')
    }
  }

  const signInEmail = async (email, password) => {
    setAuthError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      showToast('Welcome back!')
      closeAuth()
    } catch (e) {
      setAuthError(e.code === 'auth/invalid-credential' ? 'Invalid email or password' : e.message)
    }
  }

  const signUpEmail = async (name, email, password) => {
    setAuthError('')
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      const photoURL = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`
      await updateProfile(user, { displayName: name, photoURL })
      const uname = email.split('@')[0].replace(/[^a-z0-9_]/gi, '').toLowerCase()
      await setDoc(doc(db, 'users', user.uid), {
        displayName: name, photoURL, email,
        username: uname,
        followersCount: 0, followingCount: 0,
        followers: [], following: [], bookmarks: [], savedPosts: []
      })
      showToast('Account created! Welcome 🎉')
      closeAuth()
    } catch (e) {
      setAuthError(e.code === 'auth/email-already-in-use' ? 'Email already in use' : e.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
    showToast('Signed out')
  }

  return { signInWithGoogle, signInEmail, signUpEmail, logout, authError }
}
