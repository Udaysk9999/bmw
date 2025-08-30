import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Brain, QrCode, FileCheck, Users } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";
import AuthModal from "./AuthModal";

interface HeroSectionProps {
  onPatientLogin?: () => void;
}

const HeroSection = ({ onPatientLogin }: HeroSectionProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePatientLogin = () => {
    setShowAuthModal(true);
  };

  const handleAuthenticated = () => {
    onPatientLogin?.();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        <div className="parallax-element parallax-back">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-primary rounded-full opacity-20 animate-float" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-secondary rounded-full opacity-15 animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-hero rounded-full opacity-10 animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Health Lock
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Secure your medical records with advanced AI recommendations, 
              one-time sharing, and quantum-grade encryption.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" size="xl" className="animate-medical-pulse" onClick={handlePatientLogin}>
                <Shield className="w-5 h-5 mr-2" />
                Login as Patient
              </Button>
              <Button variant="glass" size="xl" onClick={() => setShowAuthModal(true)}>
                <Users className="w-5 h-5 mr-2" />
                Healthcare Provider Access
              </Button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card variant="feature" className="group">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quantum Security</h3>
                <p className="text-muted-foreground text-sm">
                  Military-grade encryption with one-time consent tokens and QR sharing
                </p>
              </div>
            </Card>

            <Card variant="feature" className="group">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Health Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  Personalized recommendations for providers, habits, and insurance
                </p>
              </div>
            </Card>

            <Card variant="feature" className="group">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-bounce">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Sharing</h3>
                <p className="text-muted-foreground text-sm">
                  Share medical data instantly with QR codes and time-limited access
                </p>
              </div>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-success" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              SOC 2 Certified
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-success" />
              End-to-End Encrypted
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;