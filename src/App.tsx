import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Onboarding from './components/Onboarding/Onboarding';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileMenu from './components/Layout/MobileMenu';
import Dashboard from './components/Dashboard/Dashboard';
import Simulation from './components/Simulation/Simulation';
import Evaluation from './components/Evaluation/Evaluation';
import Achievements from './components/Achievements/Achievements';
import Community from './components/Community/Community';
import Consultation from './components/Consultation/ConsultationClean';
import Events from './components/Events/Events';
import Profile from './components/Profile/Profile';
import CasesCollection from './components/CasesCollection/CasesCollection';
import * as authService from './services/authService';

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // 隱崎ｨｼ迥ｶ諷九・隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">隱ｭ縺ｿ霎ｼ縺ｿ荳ｭ...</p>
        </div>
      </div>
    );
  }

    // 新規登録処理
  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    department: string
  ): Promise<boolean> => {
    const newUser = await authService.register({
      name,
      email,
      password,
      department,
      role: 'learner',
    });

    if (newUser) {
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        setAuthView('login');
        return true;
      }
    }
    return false;
  };

  // 譛ｪ隱崎ｨｼ縺ｮ蝣ｴ蜷医・隱崎ｨｼ逕ｻ髱｢繧定｡ｨ遉ｺ
  if (!isAuthenticated) {
    if (authView === 'signup') {
      return (
        <Signup
          onSignup={handleSignup}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLogin={login}
        onNavigateToSignup={() => setAuthView('signup')}
      />
    );
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setActiveTab('evaluation');
  };

  const handleReturnToOnboarding = () => {
    setShowOnboarding(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
    setShowOnboarding(true);
    setActiveTab('dashboard');
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

      const getTabTitle = (tab: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      simulation: 'Simulation',
      evaluation: 'Evaluation',
      events: 'Events',
      community: 'Community',
      consultation: 'Consultation',
      cases: 'Cases',
    };
    return titles[tab] || 'App';
  };
const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToSimulation={() => setActiveTab('simulation')} />;
      case 'simulation':
        return <Simulation />;
      case 'evaluation':
        return <Evaluation />;
      case 'events':
        return <Events />;
      case 'community':
        return <Community />;
      case 'consultation':
        return <Consultation />;
      case 'cases':
        return <CasesCollection />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onNavigateToSimulation={() => setActiveTab('simulation')} />;
    }
  };

  return (
    <div className="min-h-screen bg-light-gray overflow-x-hidden">
      <Header 
        title={getTabTitle(activeTab)} 
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        onProfileClick={() => setActiveTab('profile')}
        onLogout={handleLogout}
        user={user}
      />
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReturnToOnboarding={handleReturnToOnboarding}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onReturnToOnboarding={handleReturnToOnboarding}
          onProfileClick={() => setActiveTab('profile')}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 w-full p-4 sm:p-6 max-w-7xl mx-auto overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;

