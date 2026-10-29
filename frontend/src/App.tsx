import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { DesignSystemShowcase } from './components/ui/DesignSystemShowcase';
import WorkspaceApp from './features/workspace/WorkspaceApp';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Protected LexAI Application Routes */}
          <Route 
            path="/app" 
            element={
              <AuthGuard>
                <WorkspaceApp />
              </AuthGuard>
            } 
          />
          <Route 
            path="/app/:panelId" 
            element={
              <AuthGuard>
                <WorkspaceApp />
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/design-system" 
            element={
              <div className="relative bg-[#08070D]">
                <div className="sticky top-0 z-50 bg-[#08070D] border-b border-[#30243F] px-6 py-2.5 flex items-center justify-between text-xs">
                  <span className="text-[#C084FC] font-semibold">Phase 1 Internal Design System Showcase</span>
                  <a
                    href="/"
                    className="px-3.5 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-medium transition-colors"
                  >
                    ← Back to Public Home
                  </a>
                </div>
                <DesignSystemShowcase />
              </div>
            } 
          />
          {/* Catch-all route to prevent broken routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
