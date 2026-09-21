import { useState, type FormEvent, type SVGProps } from 'react';
import { CircuitBackground } from '../../components/CircuitBackground';
import { tierOneLogo } from '../../assets/icons';
import styles from './Login.module.css';

type IconProps = SVGProps<SVGSVGElement>;

function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 15.5C3 12.46 5.69 10 9 10C12.31 10 15 12.46 15 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 8V5.5C6 3.57 7.57 2 9.5 2C11.28 2 12.75 3.35 12.97 5.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.5 9C1.5 9 4.5 3.5 9 3.5C13.5 3.5 16.5 9 16.5 9C16.5 9 13.5 14.5 9 14.5C4.5 14.5 1.5 9 1.5 9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 2.5L15.5 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M7.5 4.05C8 3.98 8.49 3.94 9 3.94C13.5 3.94 16.5 9 16.5 9C16.5 9 15.6 10.55 14.1 11.95M4.85 5.15C2.85 6.55 1.5 9 1.5 9C1.5 9 4.5 14.5 9 14.5C10.15 14.5 11.2 14.15 12.1 13.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7 10.7C10.3 11.1 9.7 11.34 9 11.34C7.53 11.34 6.34 10.15 6.34 8.68C6.34 7.98 6.58 7.38 6.98 6.98"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Enter your user ID and password to continue.');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <div className={styles.page}>
      <CircuitBackground />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img src={tierOneLogo} alt="TierOne" className={styles.logo} />
        </div>

        <h1 className={styles.title}>IoT Observability</h1>
        <p className={styles.subtitle}>Sign in to monitor devices, SIM Applets and network health.</p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>User ID</span>
            <div className={styles.inputWrap}>
              <UserIcon className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. operator@tierone.io"
                autoComplete="username"
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Password</span>
            <div className={styles.inputWrap}>
              <LockIcon className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon className={styles.eyeIcon} /> : <EyeIcon className={styles.eyeIcon} />}
              </button>
            </div>
          </label>

          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>

        <p className={styles.footerNote}>Airtel IoT NOC · SIM Applet Operations v2.1</p>
      </div>
    </div>
  );
}
