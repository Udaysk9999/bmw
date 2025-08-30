import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");

  const handlePatientLogin = () => {
    setCurrentView("dashboard");
  };

  if (currentView === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen">
      <Header onPatientLogin={handlePatientLogin} />
      <main>
        <HeroSection onPatientLogin={handlePatientLogin} />
      </main>
    </div>
  );
};

export default Index;
