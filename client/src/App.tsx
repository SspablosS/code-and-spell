import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import GamePage from './pages/GamePage';
import LandingPage from './pages/LandingPage';
import LevelsPage from './pages/LevelsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/auth.store';
import { me } from './services/auth.service';

export default function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await me();
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/levels" replace /> : <LandingPage />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/levels"
        element={
          <ProtectedRoute>
            <Layout>
              <LevelsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/level/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <GamePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
