
import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

export const App = () => {
  const [view, setView] = useState<'AUTH' | 'ONBOARDING' | 'DASHBOARD'>('AUTH');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Persistence check (simulation)
  useEffect(() => {
    const savedUser = localStorage.getItem('mmis_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('DASHBOARD');
    }
  }, []);

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('mmis_user', JSON.stringify(userData));
    setView('ONBOARDING');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mmis_user');
    setView('AUTH');
  };

  const handleCompleteOnboarding = () => {
    setView('DASHBOARD');
  };

  return (
    <div className="antialiased text-slate-900">
      {view === 'AUTH' && (
        <AuthPage 
          onSuccess={handleLogin} 
        />
      )}
      
      {view === 'ONBOARDING' && user && (
        <OnboardingWizard 
          user={user} 
          onComplete={handleCompleteOnboarding}
          onCancel={handleLogout}
        />
      )}
      
      {view === 'DASHBOARD' && user && (
        <DashboardLayout 
          user={user} 
          setUser={setUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};
