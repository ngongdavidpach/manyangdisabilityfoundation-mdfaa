import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { HomeView } from './components/views/HomeView';
import { AboutView } from './components/views/AboutView';
import { ProgramsView } from './components/views/ProgramsView';
import { RequestView } from './components/views/RequestView';
import { GetInvolvedView } from './components/views/GetInvolvedView';
import { NewsView } from './components/views/NewsView';
import { DonateView } from './components/views/DonateView';
import { GalleryView } from './components/views/GalleryView';
import { AdminSignupView } from './components/views/AdminSignupView';
import { LoginView } from './components/views/LoginView';
import { RegisterView } from './components/views/RegisterView';
import { DashboardView } from './components/views/DashboardView';
import { AdminDashboard } from './components/views/AdminDashboardView';

const AppContent: React.FC = () => {
  const { isLoading, hasAdminAccess, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const pendingReturnToRef = useRef<string | null>(null);

  // Sync scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle protected-route auth redirects
  const handleAuthRequired = (returnTo: string) => {
    pendingReturnToRef.current = returnTo || '/';
    setCurrentPage('login');
  };

  const handleLoginSuccess = () => {
    const returnTo = pendingReturnToRef.current || 'dashboard';
    pendingReturnToRef.current = null;
    // Redirect admin users to admin dashboard
    if (hasAdminAccess() && returnTo === 'login') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage(returnTo === '/' ? 'dashboard' : returnTo);
    }
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('dashboard');
  };

  const renderCurrentView = () => {
    // Public / non-protected routes
    if (currentPage === 'login') {
      return (
        <LoginView
          onSwitchToRegister={() => setCurrentPage('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentPage === 'register') {
      return (
        <RegisterView
          onSwitchToLogin={() => setCurrentPage('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    }

    if (currentPage === 'news' || currentPage.startsWith('news-')) {
      return <NewsView currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    }

    // Admin dashboard (full-screen standalone - no navbar/footer)
    if (currentPage === 'admin-dashboard') {
      return (
        <ProtectedRoute requiredRoles={['admin']} onAuthRequired={handleAuthRequired}>
          <AdminDashboard onLogout={logout} onNavigate={setCurrentPage} />
        </ProtectedRoute>
      );
    }

    // Standard layout pages
    const standardView = () => {
      switch (currentPage) {
        case 'home':
          return <HomeView setCurrentPage={setCurrentPage} />;
        case 'about':
          return <AboutView />;
        case 'programs':
          return <ProgramsView setCurrentPage={setCurrentPage} />;
        case 'gallery':
          return <GalleryView setCurrentPage={setCurrentPage} />;
        case 'get-involved':
          return <GetInvolvedView />;
        case 'admin-signup':
          return <AdminSignupView />;
        case 'dashboard':
          return (
            <ProtectedRoute onAuthRequired={handleAuthRequired}>
              <DashboardView onLogout={logout} onNavigate={setCurrentPage} />
            </ProtectedRoute>
          );
        case 'request':
          return (
            <ProtectedRoute onAuthRequired={handleAuthRequired}>
              <RequestView />
            </ProtectedRoute>
          );
        case 'donate':
          return <DonateView />;
        default:
          return <HomeView setCurrentPage={setCurrentPage} />;
      }
    };

    return standardView();
  };

  // Loading splash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  // Admin dashboard is full-screen
  if (currentPage === 'admin-dashboard') {
    return renderCurrentView();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
