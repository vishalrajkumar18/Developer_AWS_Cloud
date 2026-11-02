import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import PasswordInput from '../components/auth/PasswordInput';
import TermsModal from '../components/auth/TermsModal';
import FirebaseSetupModal from '../components/auth/FirebaseSetupModal';
import AuthSuccessModal from '../components/auth/AuthSuccessModal';
import { isFirebaseConfigured } from '../config/firebase';

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Validation & Status
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Modals
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [firebaseGuideOpen, setFirebaseGuideOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);

  // Field change helper
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  // Validation logic
  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Please enter at least 2 characters.';
    }

    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const cleanMobile = form.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      errors.mobile = 'Mobile number is required.';
    } else if (cleanMobile.length !== 10) {
      errors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms and Conditions to proceed.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = register({
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccessModalData(result.user);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Google OAuth Sign-Up
  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const result = await loginWithGoogle();
      setIsGoogleLoading(false);

      if (result.success) {
        setSuccessModalData(result.user);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMessage(err.message || 'Authentication encountered an error.');
    }
  };

  // Simulated Google User for local sandbox testing
  const handleSimulateDemoGoogle = () => {
    const demoGoogleUser = {
      name: 'Pooja Nair',
      email: 'pooja.nair@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'citizen',
      provider: 'google',
      uid: 'google-demo-citizen-67890',
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
    <AuthLayout>
      {/* Form Header */}
      <div className="civic-form-header">
        <h2>Create Account</h2>
        <p>Register to report grievances and track resolution stages.</p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="civic-alert civic-alert-error" role="alert">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google Sign-Up Button */}
      <GoogleAuthButton
        onClick={handleGoogleSignUp}
        loading={isGoogleLoading}
        text="Continue with Google"
        id="register-google-btn"
      />

      {/* Divider */}
      <div className="civic-divider">
        <span>Or register with email</span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="civic-input-group">
          <label className="civic-input-label" htmlFor="reg-name">Full Name</label>
          <div className="civic-input-box">
            <span className="civic-input-icon">
              <User size={18} />
            </span>
            <input
              id="reg-name"
              type="text"
              className={`civic-input ${fieldErrors.name ? 'has-error' : ''}`}
              placeholder="e.g. Rajesh Kumar"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          {fieldErrors.name && (
            <div className="civic-field-error">
              <AlertCircle size={14} />
              <span>{fieldErrors.name}</span>
            </div>
          )}
        </div>

        {/* Email Address */}
        <div className="civic-input-group">
          <label className="civic-input-label" htmlFor="reg-email">Email Address</label>
          <div className="civic-input-box">
            <span className="civic-input-icon">
              <Mail size={18} />
            </span>
            <input
              id="reg-email"
              type="email"
              className={`civic-input ${fieldErrors.email ? 'has-error' : ''}`}
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
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

        {/* Mobile Number */}
        <div className="civic-input-group">
          <label className="civic-input-label" htmlFor="reg-mobile">
            <span>Mobile Number</span>
            <span className="civic-input-label-optional">10-Digit Mobile</span>
          </label>
          <div className="civic-input-box">
            <span className="civic-input-icon">
              <Phone size={18} />
            </span>
            <input
              id="reg-mobile"
              type="tel"
              className={`civic-input ${fieldErrors.mobile ? 'has-error' : ''}`}
              placeholder="9876543210"
              maxLength={10}
              value={form.mobile}
              onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, ''))}
              autoComplete="tel"
              required
            />
          </div>
          {fieldErrors.mobile && (
            <div className="civic-field-error">
              <AlertCircle size={14} />
              <span>{fieldErrors.mobile}</span>
            </div>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          id="reg-password"
          label="Password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="At least 6 characters"
          error={fieldErrors.password}
          showStrength={true}
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <PasswordInput
          id="reg-confirm-password"
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder="Re-enter your password"
          error={fieldErrors.confirmPassword}
          showStrength={false}
          autoComplete="new-password"
        />

        {/* Terms and Conditions Checkbox */}
        <div style={{ margin: '14px 0 22px 0' }}>
          <label className="civic-checkbox-label" htmlFor="reg-terms">
            <input
              id="reg-terms"
              type="checkbox"
              className="civic-checkbox-input"
              checked={form.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
            />
            <span className="civic-custom-checkbox">
              {form.agreeTerms && <CheckCircle2 size={13} strokeWidth={3} />}
            </span>
            <span style={{ fontSize: '0.86rem', color: '#475569' }}>
              I agree to the{' '}
              <button
                type="button"
                className="civic-link"
                onClick={(e) => {
                  e.preventDefault();
                  setTermsModalOpen(true);
                }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}
              >
                Terms and Conditions
              </button>{' '}
              & Citizen Charter.
            </span>
          </label>
          {fieldErrors.agreeTerms && (
            <div className="civic-field-error" style={{ marginTop: 8 }}>
              <AlertCircle size={14} />
              <span>{fieldErrors.agreeTerms}</span>
            </div>
          )}
        </div>

        {/* Create Account Submit Button */}
        <button
          id="register-submit-btn"
          type="submit"
          className="civic-btn-submit"
          disabled={isSubmitting || isGoogleLoading}
        >
          {isSubmitting ? (
            <>
              <span className="civic-spinner" />
              <span>Creating Your Account…</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="civic-card-footer">
        Already have an account?{' '}
        <Link to="/login" className="civic-link">
          Sign In
        </Link>
      </div>

      {/* Modals */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
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
