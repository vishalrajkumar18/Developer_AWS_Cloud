import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  id,
  label = 'Password',
  value = '',
  onChange,
  placeholder = 'Enter password',
  error = '',
  showStrength = false,
  required = true,
  autoComplete = 'current-password',
  helperText = '',
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Compute password strength if requested
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', class: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', class: 'active-weak' };
    if (score <= 3) return { score: 2, text: 'Fair', class: 'active-medium' };
    return { score: 3, text: 'Strong', class: 'active-strong' };
  };

  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className="civic-input-group">
      <div className="civic-input-label">
        <label htmlFor={id}>{label}</label>
        {helperText && <span className="civic-input-label-optional">{helperText}</span>}
      </div>

      <div className="civic-input-box">
        <span className="civic-input-icon">
          <Lock size={18} />
        </span>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`civic-input ${error ? 'has-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          style={{ paddingRight: 44 }}
        />

        <button
          type="button"
          className="civic-password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Strength indicator */}
      {showStrength && value.length > 0 && (
        <div className="civic-pwd-strength">
          <div className="civic-pwd-bars">
            <div className={`civic-pwd-bar ${strength.score >= 1 ? strength.class : ''}`} />
            <div className={`civic-pwd-bar ${strength.score >= 2 ? strength.class : ''}`} />
            <div className={`civic-pwd-bar ${strength.score >= 3 ? strength.class : ''}`} />
          </div>
          <div className="civic-pwd-text">
            <span>Security Strength</span>
            <span style={{ 
              color: strength.score === 1 ? '#EF4444' : strength.score === 2 ? '#F59E0B' : '#10B981' 
            }}>
              {strength.text}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="civic-field-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
