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
import LexUIApp from './gpt/App';

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
                <LexUIApp />
              </AuthGuard>
            } 
          />
          <Route 
            path="/app/:panelId" 
            element={
              <AuthGuard>
                <LexUIApp />
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/design-system" 
            element={
              <div className="relative">
                <div className="sticky top-0 z-50 bg-[#070A12] border-b border-indigo-500/30 px-6 py-2 flex items-center justify-between text-xs">
                  <span className="text-indigo-400 font-semibold">Phase 1 Internal Design System Showcase</span>
                  <a
                    href="/"
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
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
