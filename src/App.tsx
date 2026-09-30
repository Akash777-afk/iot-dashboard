import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Devices } from './pages/Devices/Devices';
import { DeviceDetail } from './pages/DeviceDetail/DeviceDetail';
import { SimApplet } from './pages/SimApplet/SimApplet';
import { Analytics } from './pages/Analytics/Analytics';
import { loadRealDataset } from './data/realDataset';

const AUTH_KEY = 'simAppletAuthenticated';

function DatasetLoadingScreen({ error }: { error: string | null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 12,
        fontFamily: 'inherit',
        color: '#475569',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '3px solid #cbd5e1',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      <p style={{ margin: 0, fontSize: 14 }}>
        {error ? 'Could not load the master dataset — showing sample data instead.' : 'Loading device dataset…'}
      </p>
    </div>
  );
}

function RequireAuth({ authenticated, children }: { authenticated: boolean; children: ReactNode }) {
  if (!authenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Persistent, impossible-to-miss banner shown whenever the app is running on the synthetic
    fallback dataset instead of the real master data — so that never passes as unnoticed. */
function FallbackDataBanner({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
        padding: '9px 18px',
        background: '#dc2626',
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        textAlign: 'center',
      }}
    >
      <span>⚠ Could not load the real master dataset — every page is showing sample/placeholder data, not your Excel data.</span>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        style={{
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: 6,
          background: 'transparent',
          color: '#fff',
          padding: '3px 10px',
          fontSize: 12,
          fontWeight: 700,
          cursor: retrying ? 'default' : 'pointer',
          opacity: retrying ? 0.6 : 1,
        }}
      >
        {retrying ? 'Retrying…' : 'Retry'}
      </button>
    </div>
  );
}

/** Retries the fetch+parse a couple of times before giving up — the dataset file is ~200MB,
    so a transient network/memory hiccup is more likely here than for typical page assets. */
async function loadRealDatasetWithRetries(maxAttempts = 3): Promise<void> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await loadRealDataset();
      return;
    } catch (err) {
      lastErr = err;
      console.error(`Master dataset load attempt ${attempt}/${maxAttempts} failed:`, err);
    }
  }
  throw lastErr;
}

function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [datasetReady, setDatasetReady] = useState(false);
  const [datasetError, setDatasetError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const attemptLoad = () => {
    loadRealDatasetWithRetries()
      .then(() => {
        setDatasetError(null);
        setDatasetReady(true);
        setRetrying(false);
      })
      .catch((err) => {
        console.error('Failed to load master dataset after retries:', err);
        setDatasetError(String(err));
        setDatasetReady(true);
        setRetrying(false);
      });
  };

  useEffect(() => {
    attemptLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetryClick = () => {
    setRetrying(true);
    attemptLoad();
  };

  const handleLogin = () => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    navigate('/login');
  };

  if (!datasetReady) {
    return <DatasetLoadingScreen error={datasetError} />;
  }

  return (
    <AuthContext.Provider value={{ authenticated, logout: handleLogout }}>
      {datasetError && <FallbackDataBanner onRetry={handleRetryClick} retrying={retrying} />}
      <Routes>
        <Route path="/login" element={authenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <RequireAuth authenticated={authenticated}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/devices"
          element={
            <RequireAuth authenticated={authenticated}>
              <Devices />
            </RequireAuth>
          }
        />
        <Route
          path="/devices/:deviceId"
          element={
            <RequireAuth authenticated={authenticated}>
              <DeviceDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/sim-applet"
          element={
            <RequireAuth authenticated={authenticated}>
              <SimApplet />
            </RequireAuth>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireAuth authenticated={authenticated}>
              <Analytics />
            </RequireAuth>
          }
        />
        {/* Legacy routes folded into the new structure: keep old links working. */}
        <Route path="/onboarding" element={<Navigate to="/devices" replace state={{ tab: 'onboarding' }} />} />
        <Route path="/security" element={<Navigate to="/devices" replace state={{ tab: 'security' }} />} />
        <Route path="/network-kpis" element={<Navigate to="/analytics" replace />} />
        <Route
          path="/default-mapping"
          element={<Navigate to="/sim-applet" replace state={{ tab: 'default-mapping' }} />}
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
