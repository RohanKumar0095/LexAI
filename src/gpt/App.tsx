import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ChatScreen from './components/chat/ChatScreen';

// Auth
import { useAuth } from '../context/AuthContext';

// Hooks
import { useTheme } from './hooks/useTheme';
import { useSidebar } from './hooks/useSidebar';
import { useChat } from './hooks/useChat';

// Panels
import HistoryPanel from './components/panels/HistoryPanel';
import DailyLawPanel from './components/panels/DailyLawPanel';
import RightsCheckerPanel from './components/panels/RightsCheckerPanel';
import ScenarioSimulatorPanel from './components/panels/ScenarioSimulatorPanel';
import RoadmapPanel from './components/panels/RoadmapPanel';
import StateAwarenessPanel from './components/panels/StateAwarenessPanel';
import SosPanel from './components/panels/SosPanel';
import LawCategoriesPanel from './components/panels/LawCategoriesPanel';
import DocumentAiPanel from './components/panels/DocumentAiPanel';
import ComplaintGeneratorPanel from './components/panels/ComplaintGeneratorPanel';
import GovernmentResourcesPanel from './components/panels/GovernmentResourcesPanel';
import MyLearningPanel from './components/panels/MyLearningPanel';
import SavedLawsPanel from './components/panels/SavedLawsPanel';
import NotificationsPanel from './components/panels/NotificationsPanel';
import SettingsPanel from './components/panels/SettingsPanel';

// Data
import { mockDailyLaws } from './data/mockLaws';
import { mockScenarios } from './data/mockScenarios';
import { mockCategories } from './data/mockCategories';
import { mockNotifications } from './data/mockNotifications';

// Types
import type { UserSettings, Notification } from './types/user';

export function AppContent() {
  const navigate = useNavigate();
  const { panelId } = useParams();
  const { user } = useAuth();

  // Selected sidebar workspace panel (mapped to route params)
  const activePanel = panelId || null;

  const handleSelectPanel = (id: string | null) => {
    if (id === null) {
      startNewChat();
      navigate('/app');
    } else {
      navigate(`/app/${id}`);
    }
  };

  // State Management
  const { theme, setTheme } = useTheme();
  const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobileOpen, closeMobile } = useSidebar();
  
  const {
    messages,
    conversations,
    activeConversationId,
    isTyping,
    explainMode,
    setExplainMode,
    sendMessage,
    startNewChat,
    loadConversation,
    deleteConversation,
    addPinConversation,
    clearAllConversations
  } = useChat();

  // User details & local preferences states
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    const saved = localStorage.getItem('lexai-lang');
    return (saved as 'en' | 'hi') || user?.language || 'en';
  });

  const [locationState, setLocationState] = useState(() => {
    return localStorage.getItem('lexai-state') || user?.state || 'Delhi';
  });

  const [locationDistrict, setLocationDistrict] = useState(() => {
    return localStorage.getItem('lexai-district') || user?.district || 'Delhi NCR';
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('lexai-notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lexai-saved-articles');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedMsgIds, setBookmarkedMsgIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lexai-bookmarked-messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [learningXp, setLearningXp] = useState<number>(() => {
    const saved = localStorage.getItem('lexai-xp');
    return saved ? Number(saved) : 120; // default 120 XP
  });

  const [chatHistoryEnabled, setChatHistoryEnabled] = useState(true);

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('lexai-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('lexai-state', locationState);
  }, [locationState]);

  useEffect(() => {
    localStorage.setItem('lexai-district', locationDistrict);
  }, [locationDistrict]);

  useEffect(() => {
    localStorage.setItem('lexai-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lexai-saved-articles', JSON.stringify(savedArticleIds));
  }, [savedArticleIds]);

  useEffect(() => {
    localStorage.setItem('lexai-bookmarked-messages', JSON.stringify(bookmarkedMsgIds));
  }, [bookmarkedMsgIds]);

  useEffect(() => {
    localStorage.setItem('lexai-xp', learningXp.toString());
  }, [learningXp]);

  // Actions Callbacks
  const handleAddXp = (amount: number) => {
    setLearningXp(prev => prev + amount);
  };

  const handleToggleBookmarkArticle = (id: string) => {
    setSavedArticleIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBookmarkMessage = (msgId: string) => {
    setBookmarkedMsgIds(prev => 
      prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]
    );
  };

  const handleSaveLocation = (state: string, district: string, lang: 'en' | 'hi') => {
    setLocationState(state);
    setLocationDistrict(district);
    setLanguage(lang);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    if (newSettings.language !== undefined) setLanguage(newSettings.language);
    if (newSettings.theme !== undefined) setTheme(newSettings.theme);
    if (newSettings.chatHistoryEnabled !== undefined) setChatHistoryEnabled(newSettings.chatHistoryEnabled);
  };

  const handleAskLex = (prompt: string) => {
    handleSelectPanel(null); // Close split screen
    sendMessage(prompt);
  };

  const handleStartLearning = () => {
    handleSelectPanel('daily-law');
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const currentConversationTitle = activeConv ? activeConv.title : '';

  // Settings State Object
  const userSettings: UserSettings = {
    language,
    theme,
    locationState,
    locationDistrict,
    accessibilityTextSize: 'base',
    accessibilityReducedMotion: false,
    accessibilityHighContrast: false,
    chatHistoryEnabled,
    guestMode: !user
  };

  // Determine Active Workspace Panel Component
  const renderWorkspacePanel = () => {
    switch (activePanel) {
      case 'daily-law':
        return (
          <DailyLawPanel 
            dailyLaws={mockDailyLaws} 
            onAddXp={handleAddXp} 
            onAskLex={handleAskLex} 
          />
        );
      case 'rights-checker':
        return <RightsCheckerPanel onAskLex={handleAskLex} />;
      case 'scenario-simulator':
        return (
          <ScenarioSimulatorPanel 
            scenarios={mockScenarios} 
            onOpenSos={() => handleSelectPanel('sos-help')} 
            onAskLex={handleAskLex} 
          />
        );
      case 'law-categories':
        return (
          <LawCategoriesPanel 
            categories={mockCategories} 
            onAskLex={handleAskLex} 
            savedArticleIds={savedArticleIds}
            onToggleBookmarkArticle={handleToggleBookmarkArticle}
          />
        );
      case 'legal-roadmaps':
        return <RoadmapPanel />;
      case 'document-ai':
        return <DocumentAiPanel onAskLex={handleAskLex} />;
      case 'complaint-generator':
        return <ComplaintGeneratorPanel onAskLex={handleAskLex} />;
      case 'government-resources':
        return <GovernmentResourcesPanel />;
      case 'state-awareness':
        return (
          <StateAwarenessPanel 
            initialState={locationState}
            initialDistrict={locationDistrict}
            initialLanguage={language}
            onSave={handleSaveLocation}
          />
        );
      case 'sos-help':
        return <SosPanel activeState={locationState} activeDistrict={locationDistrict} />;
      case 'my-learning':
        return <MyLearningPanel xp={learningXp} onSelectPanel={handleSelectPanel} />;
      case 'saved-laws':
        return (
          <SavedLawsPanel 
            savedArticleIds={savedArticleIds}
            categories={mockCategories}
            onToggleBookmarkArticle={handleToggleBookmarkArticle}
            onAskLex={handleAskLex}
            bookmarkedMsgIds={bookmarkedMsgIds}
            onBookmarkMessage={handleBookmarkMessage}
            conversations={conversations}
            onSelectPanel={handleSelectPanel}
          />
        );
      case 'notifications':
        return (
          <NotificationsPanel 
            notifications={notifications} 
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onSelectPanel={handleSelectPanel}
          />
        );
      case 'settings':
        return <SettingsPanel settings={userSettings} onUpdateSettings={handleUpdateSettings} />;
      case 'history':
        return (
          <HistoryPanel 
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              loadConversation(id);
              navigate('/app');
            }}
            onDeleteConversation={deleteConversation}
            onPinConversation={addPinConversation}
            onClearAllHistory={clearAllConversations}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell
      theme={theme}
      setTheme={setTheme}
      language={language}
      setLanguage={setLanguage}
      activePanel={activePanel}
      onSelectPanel={handleSelectPanel}
      isSidebarCollapsed={isCollapsed}
      onToggleSidebar={toggleCollapse}
      isMobileSidebarOpen={isMobileOpen}
      onToggleMobileSidebar={toggleMobileOpen}
      onCloseMobileSidebar={closeMobile}
      notifications={notifications}
      guestMode={userSettings.guestMode}
      currentConversationTitle={currentConversationTitle}
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={(id) => {
        loadConversation(id);
        navigate('/app');
      }}
      onPinConversation={addPinConversation}
      onDeleteConversation={deleteConversation}
    >
      <ChatScreen
        messages={messages}
        isTyping={isTyping}
        explainMode={explainMode}
        onChangeExplainMode={setExplainMode}
        onSendMessage={sendMessage}
        onSelectQuickPrompt={handleAskLex}
        onStartLearning={handleStartLearning}
        activePanelId={activePanel}
        activePanelNode={renderWorkspacePanel()}
        onClosePanel={() => handleSelectPanel(null)}
        bookmarkedMsgIds={bookmarkedMsgIds}
        onBookmarkMessage={handleBookmarkMessage}
      />
    </AppShell>
  );
}

export default function App() {
  return <AppContent />;
}
