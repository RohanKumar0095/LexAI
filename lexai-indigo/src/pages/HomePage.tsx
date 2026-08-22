import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/shell/Header';
import { Footer } from '../components/shell/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { ConceptSection } from '../components/home/ConceptSection';
import { ChooseJourneySection } from '../components/home/ChooseJourneySection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { LearningProgressionSection } from '../components/home/LearningProgressionSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TechStackSection } from '../components/home/TechStackSection';
import { FutureRoadmapSection } from '../components/home/FutureRoadmapSection';
import { ExploreProductSection } from '../components/home/ExploreProductSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentLang, setCurrentLang] = useState<'EN' | 'HI'>('EN');

  const handleEnterApp = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  const handleOpenAuth = (persona: 'citizen' | 'lawyer' = 'citizen') => {
    // If they explicitly target a flow, we route to login/signup.
    // Lawyer pathways will show a coming-soon warning inside those pages.
    if (persona === 'citizen') {
      navigate('/login');
    } else {
      // Lawyer clicked
      navigate('/login');
    }
  };

  const handleToggleLang = () => {
    setCurrentLang((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  return (
    <div className="lexai-ambient-bg lexai-grid-pattern min-h-screen text-[#F8FAFC] selection:bg-indigo-500/30">
      
      {/* Shell Header */}
      <Header
        onOpenAuth={handleOpenAuth}
        onEnterApp={handleEnterApp}
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        onToggleDesignSystem={() => navigate('/design-system')}
        showingDesignSystem={false}
      />

      {/* Main Home Content */}
      <main>
        <HeroSection
          onEnterApp={handleEnterApp}
          onOpenAuth={() => navigate('/signup')} // Direct new users to register
          currentLang={currentLang}
        />

        <ConceptSection />

        <ChooseJourneySection
          onOpenAuth={handleOpenAuth}
          onEnterApp={handleEnterApp}
        />

        <FeaturesSection onEnterApp={handleEnterApp} />

        <LearningProgressionSection />

        <HowItWorksSection />

        <TechStackSection />

        <FutureRoadmapSection />

        <ExploreProductSection onEnterApp={handleEnterApp} />
      </main>

      {/* Shell Footer */}
      <Footer />
    </div>
  );
};
