import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import PasswordInput from '../components/auth/PasswordInput';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import FirebaseSetupModal from '../components/auth/FirebaseSetupModal';
import AuthSuccessModal from '../components/auth/AuthSuccessModal';
import { isFirebaseConfigured } from '../config/firebase';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Loaders
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Modals
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [firebaseGuideOpen, setFirebaseGuideOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);

  // Load remembered email if present
  useEffect(() => {
    const savedEmail = localStorage.getItem('civictrack_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Quick Demo credentials selector handler
  const handleSelectDemoUser = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFieldErrors({});
    setErrorMessage('');
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit standard login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    // Smooth micro-delay for realistic feedback
    await new Promise((r) => setTimeout(r, 450));

    const result = login(email, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      // Role-based destination
      if (result.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (result.role === 'department') {
        navigate('/department-dashboard');
      } else {
        // Show success modal displaying profile before redirect
        setSuccessModalData(result.user);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  // Submit Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const result = await loginWithGoogle();
      setIsGoogleLoading(false);

      if (result.success) {
        // Show verified Google profile card and redirect to citizen dashboard
        setSuccessModalData(result.user);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMessage(err.message || 'Authentication encountered an error.');
    }
  };

  // Simulate Google User for interactive demonstration if user hasn't added .env yet
  const handleSimulateDemoGoogle = () => {
    const demoGoogleUser = {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'citizen',
      provider: 'google',
      uid: 'google-demo-citizen-12345',
      joinDate: new Date().toISOString().slice(0, 10),
    };

    localStorage.setItem('civictrack_user', JSON.stringify(demoGoogleUser));
    const registered = JSON.parse(localStorage.getItem('civictrack_registered') || '[]');
    if (!registered.some((u) => u.email === demoGoogleUser.email)) {
      registered.push(demoGoogleUser);
      localStorage.setItem('civictrack_registered', JSON.stringify(registered));
    }

    setSuccessModalData(demoGoogleUser);
  };

  return (
    <AuthLayout onSelectDemoUser={handleSelectDemoUser}>
      {/* Form Header */}
      <div className="civic-form-header">
        <h2>Welcome back</h2>
        <p>Sign in to report issues or access administrative management.</p>
      </div>

      {/* Quick Role Switcher */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: 4,
        background: '#F1F5F9',
        borderRadius: 12,
        marginBottom: 20
      }}>
        <button
          type="button"
          onClick={() => handleSelectDemoUser('citizen@example.com', 'citizen123')}
          style={{
            flex: 1,
            padding: '8px 8px',
            borderRadius: 9,
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            background: email === 'citizen@example.com' ? '#FFFFFF' : 'transparent',
            color: email === 'citizen@example.com' ? '#0A1628' : '#64748B',
            boxShadow: email === 'citizen@example.com' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          👤 Citizen
        </button>
        <button
          type="button"
          id="admin-quick-login-btn"
          onClick={() => handleSelectDemoUser('admin@civictrack.gov.in', 'admin123')}
          style={{
            flex: 1,
            padding: '8px 8px',
            borderRadius: 9,
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            background: email === 'admin@civictrack.gov.in' ? '#0EA5E9' : 'transparent',
            color: email === 'admin@civictrack.gov.in' ? '#FFFFFF' : '#64748B',
            boxShadow: email === 'admin@civictrack.gov.in' ? '0 2px 8px rgba(14,165,233,0.35)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🛡️ Admin Portal
        </button>
        <button
          type="button"
          onClick={() => handleSelectDemoUser('pwd@civictrack.gov.in', 'dept123')}
          style={{
            flex: 1,
            padding: '8px 8px',
            borderRadius: 9,
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            background: email === 'pwd@civictrack.gov.in' ? '#FFFFFF' : 'transparent',
            color: email === 'pwd@civictrack.gov.in' ? '#0A1628' : '#64748B',
            boxShadow: email === 'pwd@civictrack.gov.in' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🏢 Department
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="civic-alert civic-alert-error" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google Sign-In Button */}
      <GoogleAuthButton
        onClick={handleGoogleSignIn}
        loading={isGoogleLoading}
        text="Sign in with Google"
        id="login-google-btn"
      />

      {/* Divider */}
      <div className="civic-divider">
        <span>Or sign in with email</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <div className="civic-input-group">
          <label className="civic-input-label" htmlFor="login-email">
            <span>Email Address</span>
          </label>
          <div className="civic-input-box">
            <span className="civic-input-icon">
              <Mail size={18} />
            </span>
            <input
              id="login-email"
              type="email"
              className={`civic-input ${fieldErrors.email ? 'has-error' : ''}`}
              placeholder="e.g. citizen@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
              }}
              autoComplete="email"
              required
            />
          </div>
          {fieldErrors.email && (
            <div className="civic-field-error">
              <AlertCircle size={14} />
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
          }}
          placeholder="Enter your password"
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        {/* Options: Remember Me & Forgot Password */}
        <div className="civic-form-options">
          <label className="civic-checkbox-label" htmlFor="login-remember">
            <input
              id="login-remember"
              type="checkbox"
              className="civic-checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="civic-custom-checkbox">
              {rememberMe && <CheckCircle2 size={13} strokeWidth={3} />}
            </span>
            <span>Remember Me</span>
          </label>

          <button
            type="button"
            className="civic-link"
            onClick={() => setForgotModalOpen(true)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          id="login-submit-btn"
          type="submit"
          className="civic-btn-submit"
          disabled={isSubmitting || isGoogleLoading}
        >
          {isSubmitting ? (
            <>
              <span className="civic-spinner" />
              <span>Verifying Credentials…</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="civic-card-footer">
        Don't have an account?{' '}
        <Link to="/register" className="civic-link">
          Create an Account
        </Link>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
      />

      <FirebaseSetupModal
        isOpen={firebaseGuideOpen}
        onClose={() => setFirebaseGuideOpen(false)}
        onSimulateDemoGoogle={handleSimulateDemoGoogle}
      />

      <AuthSuccessModal
        isOpen={Boolean(successModalData)}
        user={successModalData}
        redirectTo="/citizen-dashboard"
      />
    </AuthLayout>
  );
}
