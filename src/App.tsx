import { useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Devices } from './pages/Devices/Devices';
import { DeviceDetail } from './pages/DeviceDetail/DeviceDetail';
import { SimApplet } from './pages/SimApplet/SimApplet';
import { Analytics } from './pages/Analytics/Analytics';

const AUTH_KEY = 'simAppletAuthenticated';

function RequireAuth({ authenticated, children }: { authenticated: boolean; children: ReactNode }) {
  if (!authenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');

  const handleLogin = () => {
    sessionStorage.setItem(AUTH_KEY, 'true');
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authenticated, logout: handleLogout }}>
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
