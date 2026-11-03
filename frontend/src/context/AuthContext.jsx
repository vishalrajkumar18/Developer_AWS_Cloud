import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockComplaints } from '../data/mockData';
import api from '../services/api';
import {
  signInWithGoogle as firebaseSignInWithGoogle,
  isFirebaseConfigured,
  getFriendlyAuthErrorMessage,
  triggerPasswordReset,
  auth
} from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // 1. Load stored session
    const stored = localStorage.getItem('civictrack_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }

    // 2. Load complaints from storage with mock fallback
    const storedComplaints = localStorage.getItem('civictrack_complaints');
    if (storedComplaints) {
      try {
        setComplaints(JSON.parse(storedComplaints));
      } catch (e) {
        setComplaints(mockComplaints);
      }
    } else {
      setComplaints(mockComplaints);
      localStorage.setItem('civictrack_complaints', JSON.stringify(mockComplaints));
    }

    // 2b. Attempt live sync with Flask REST API & MySQL
    api.getComplaints().then((res) => {
      if (res.ok && res.data && res.data.complaints && res.data.complaints.length > 0) {
        setComplaints(res.data.complaints);
        localStorage.setItem('civictrack_complaints', JSON.stringify(res.data.complaints));
      }
    }).catch(() => {});

    // 3. Listen to Firebase Auth state if configured
    let unsubscribe = () => {};
    if (isFirebaseConfigured() && auth) {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // If logged in via Firebase and not yet stored
          const currentUser = JSON.parse(localStorage.getItem('civictrack_user') || 'null');
          if (!currentUser || currentUser.uid !== firebaseUser.uid) {
            const mappedUser = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Citizen User',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: 'citizen',
              uid: firebaseUser.uid,
              provider: 'google',
              joinDate: new Date().toISOString().slice(0, 10),
            };
            setUser(mappedUser);
            localStorage.setItem('civictrack_user', JSON.stringify(mappedUser));
          }
        }
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = (email, password, rememberMe = true) => {
    const registeredUsers = JSON.parse(localStorage.getItem('civictrack_registered') || '[]');
    const allUsers = [...mockUsers, ...registeredUsers];
    const found = allUsers.find(u => u.email?.toLowerCase() === email?.trim()?.toLowerCase() && u.password === password);
    
    if (found) {
      const userInfo = { ...found };
      delete userInfo.password;
      setUser(userInfo);
      if (rememberMe) {
        localStorage.setItem('civictrack_user', JSON.stringify(userInfo));
        localStorage.setItem('civictrack_remember_email', email);
      } else {
        sessionStorage.setItem('civictrack_user', JSON.stringify(userInfo));
        localStorage.removeItem('civictrack_remember_email');
      }
      return { success: true, role: found.role, user: userInfo };
    }
    return { success: false, message: 'Invalid email address or password. Please try again.' };
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        code: 'CONFIG_MISSING',
        message: 'Firebase is not configured with valid API keys. Please configure your .env file with Google OAuth credentials.'
      };
    }

    try {
      const firebaseUser = await firebaseSignInWithGoogle();
      const userInfo = {
        name: firebaseUser.displayName || 'Citizen User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'citizen',
        uid: firebaseUser.uid,
        provider: 'google',
        joinDate: new Date().toISOString().slice(0, 10),
      };

      // Save user to registered database in localStorage if new
      const registeredUsers = JSON.parse(localStorage.getItem('civictrack_registered') || '[]');
      if (!registeredUsers.some(u => u.email === userInfo.email)) {
        registeredUsers.push({ ...userInfo, source: 'google' });
        localStorage.setItem('civictrack_registered', JSON.stringify(registeredUsers));
      }

      setUser(userInfo);
      localStorage.setItem('civictrack_user', JSON.stringify(userInfo));

      return { success: true, user: userInfo, role: 'citizen' };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        code: error.code || 'UNKNOWN',
        message: getFriendlyAuthErrorMessage(error)
      };
    }
  };

  const register = (data) => {
    const registeredUsers = JSON.parse(localStorage.getItem('civictrack_registered') || '[]');
    const allUsers = [...mockUsers, ...registeredUsers];
    if (allUsers.find(u => u.email?.toLowerCase() === data.email?.trim()?.toLowerCase())) {
      return { success: false, message: 'An account with this email address is already registered.' };
    }

    const newUser = {
      name: data.name?.trim(),
      email: data.email?.trim()?.toLowerCase(),
      mobile: data.mobile?.trim(),
      password: data.password,
      role: 'citizen',
      joinDate: new Date().toISOString().slice(0, 10)
    };

    registeredUsers.push(newUser);
    localStorage.setItem('civictrack_registered', JSON.stringify(registeredUsers));

    const userInfo = { ...newUser };
    delete userInfo.password;
    setUser(userInfo);
    localStorage.setItem('civictrack_user', JSON.stringify(userInfo));
    return { success: true, user: userInfo };
  };

  const resetPassword = async (email) => {
    const cleanEmail = email?.trim()?.toLowerCase();
    if (!cleanEmail) return { success: false, message: 'Please enter a valid email address.' };

    if (isFirebaseConfigured()) {
      try {
        await triggerPasswordReset(cleanEmail);
        return { success: true, message: `Password reset link sent to ${cleanEmail}. Please check your inbox.` };
      } catch (err) {
        return { success: false, message: getFriendlyAuthErrorMessage(err) };
      }
    }

    // Fallback verification for demo / mock users
    const registeredUsers = JSON.parse(localStorage.getItem('civictrack_registered') || '[]');
    const allUsers = [...mockUsers, ...registeredUsers];
    const found = allUsers.find(u => u.email?.toLowerCase() === cleanEmail);

    if (found) {
      return {
        success: true,
        message: `A password reset link has been dispatched to ${cleanEmail}. (Demo Mode: password is '${found.password}')`
      };
    }
    return {
      success: false,
      message: 'No registered CivicTrack account was found with that email address.'
    };
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured() && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Firebase signout note:', e);
    }
    setUser(null);
    localStorage.removeItem('civictrack_user');
    sessionStorage.removeItem('civictrack_user');
  };

  const submitComplaint = (data) => {
    const newComplaint = {
      ...data,
      id: 'CIV-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000),
      status: 'pending',
      submittedBy: user?.email,
      submittedDate: new Date().toISOString().slice(0, 10),
      department: getDepartment(data.category),
      assignedOfficer: null,
      timeline: [
        { stage: 'Submitted', date: new Date().toISOString().slice(0, 10), note: 'Complaint registered successfully', done: true },
        { stage: 'Assigned', date: null, note: 'Pending department assignment', done: false },
        { stage: 'In Progress', date: null, note: '', done: false },
        { stage: 'Resolved', date: null, note: '', done: false },
      ],
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('civictrack_complaints', JSON.stringify(updated));

    // Asynchronously sync with Flask REST API
    api.createComplaint({
      ...data,
      tracking_id: newComplaint.id,
      submittedBy: user?.email
    }).catch(err => console.warn('Backend sync deferred:', err));

    return newComplaint.id;
  };

  const updateComplaintStatus = (id, newStatusOrUpdates, noteText = '') => {
    const today = new Date().toISOString().slice(0, 10);
    const isObject = typeof newStatusOrUpdates === 'object' && newStatusOrUpdates !== null;
    const status = isObject ? newStatusOrUpdates.status : newStatusOrUpdates;
    const note = isObject ? (newStatusOrUpdates.note || '') : noteText;
    const department = isObject ? newStatusOrUpdates.department : undefined;
    const assignedOfficer = isObject ? newStatusOrUpdates.assignedOfficer : undefined;
    const priority = isObject ? newStatusOrUpdates.priority : undefined;

    const updated = complaints.map(c => {
      if (c.id !== id) return c;

      const newTimeline = [...(c.timeline || [])];

      if (status === 'in-progress') {
        const assignedIdx = newTimeline.findIndex(t => t.stage === 'Assigned');
        if (assignedIdx !== -1) {
          newTimeline[assignedIdx] = {
            ...newTimeline[assignedIdx],
            done: true,
            date: newTimeline[assignedIdx].date || today,
            note: `Assigned to ${department || c.department}${assignedOfficer ? ` (Officer: ${assignedOfficer})` : ''}`
          };
        }
        const progIdx = newTimeline.findIndex(t => t.stage === 'In Progress');
        if (progIdx !== -1) {
          newTimeline[progIdx] = {
            ...newTimeline[progIdx],
            done: true,
            date: today,
            note: note || 'Field investigation and resolution work in progress'
          };
        }
      } else if (status === 'resolved') {
        newTimeline.forEach((t, i) => {
          if (t.stage !== 'Resolved') {
            newTimeline[i] = { ...t, done: true, date: t.date || today };
          } else {
            newTimeline[i] = {
              ...t,
              done: true,
              date: today,
              note: note || 'Grievance verified and successfully resolved by municipal authority'
            };
          }
        });
      } else if (status === 'rejected') {
        const rejIdx = newTimeline.findIndex(t => t.stage === 'Rejected');
        if (rejIdx !== -1) {
          newTimeline[rejIdx] = { ...newTimeline[rejIdx], done: true, date: today, note: note || 'Complaint rejected after administrative review' };
        } else {
          newTimeline.push({ stage: 'Rejected', done: true, date: today, note: note || 'Complaint rejected after administrative review' });
        }
      } else if (status === 'pending') {
        // Reset stages
        newTimeline.forEach((t, i) => {
          if (t.stage !== 'Submitted') {
            newTimeline[i] = { ...t, done: false, date: null, note: '' };
          }
        });
      }

      return {
        ...c,
        status,
        department: department !== undefined ? department : c.department,
        assignedOfficer: assignedOfficer !== undefined ? assignedOfficer : c.assignedOfficer,
        priority: priority !== undefined ? priority : c.priority,
        adminRemarks: note || c.adminRemarks,
        timeline: newTimeline,
      };
    });

    setComplaints(updated);
    localStorage.setItem('civictrack_complaints', JSON.stringify(updated));

    // Asynchronously sync update with Flask REST API
    api.updateComplaint(
      id,
      isObject ? newStatusOrUpdates : { status: newStatusOrUpdates, note: noteText }
    ).catch(err => console.warn('Backend update sync deferred:', err));

    return true;
  };

  const getDepartment = (category) => {
    const map = {
      'Road Damage': 'Roads & Infrastructure',
      'Streetlight': 'Electrical Department',
      'Water Leakage': 'Water Supply Department',
      'Drainage': 'Sanitation Department',
      'Garbage Collection': 'Sanitation Department',
      'Traffic Signal': 'Traffic Control Department',
    };
    return map[category] || 'General Services';
  };

  const getMyComplaints = () => complaints.filter(c => c.submittedBy === user?.email);

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      complaints,
      submitComplaint,
      updateComplaintStatus,
      getMyComplaints
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
