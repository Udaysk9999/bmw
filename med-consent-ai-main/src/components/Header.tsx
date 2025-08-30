import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Users, Lock } from "lucide-react";
import AuthModal from "./AuthModal";

interface HeaderProps {
  onPatientLogin?: () => void;
}

const Header = ({ onPatientLogin }: HeaderProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePatientLogin = () => {
    setShowAuthModal(true);
  };

  const handleAuthenticated = () => {
    onPatientLogin?.();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Health Lock</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Health Security</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#security" className="text-sm font-medium hover:text-primary transition-smooth">
              Security
            </a>
            <a href="#ai" className="text-sm font-medium hover:text-primary transition-smooth">
              AI Assistant
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={handlePatientLogin}>
              Login as Patient
            </Button>
          </div>
        </div>
      </div>
      
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </header>
  );
};

export default Header;