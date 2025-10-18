import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeToggle from './components/ThemeToggle';
import AuthModal from './components/AuthModal';
import RegistrationForm from './components/RegistrationForm';
import InfoBox from './components/InfoBox';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAuthSuccess = () => {
    setShowAdmin(true);
  };

  const handleLogout = () => {
    logout();
    setShowAdmin(false);
  };

  const handleBackHome = () => {
    setShowAdmin(false);
  };

  if (showAdmin && isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} onBackHome={handleBackHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-lavender-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-lavender-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl">✨</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-primary-700 dark:text-primary-300">
                  Women's Event
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Jardin Public - 1er novembre 2025
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-smooth hover:scale-105 shadow-md text-sm sm:text-base"
              >
                <UserCircle size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            <RegistrationForm />
          </div>

          {/* Info Section */}
          <div className="order-1 lg:order-2">
            <InfoBox />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-8 sm:mt-16 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            © 2025 Women's Event. Tous droits réservés.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">
            Fait avec ❤️ pour la communauté
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
