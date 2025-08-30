import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Brain, 
  Share2, 
  Upload, 
  Activity, 
  Calendar,
  MapPin,
  CreditCard,
  QrCode,
  TrendingUp,
  Clock,
  Settings
} from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import { aiHealthService, HealthRecommendation, PatientProfile } from "@/services/aiService";
import { AISetupModal } from "@/components/AISetupModal";
import { FileUpload } from "@/components/FileUpload";
import { QRGenerator } from "@/components/QRGenerator";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [showAISetup, setShowAISetup] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<HealthRecommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const mockRecords = [
    { id: 1, type: "Blood Test", date: "2024-01-15", size: "2.4 MB" },
    { id: 2, type: "X-Ray Chest", date: "2024-01-10", size: "15.2 MB" },
    { id: 3, type: "MRI Brain", date: "2024-01-05", size: "245 MB" },
  ];

  // Mock patient profile - in a real app this would come from user data
  const patientProfile: PatientProfile = {
    age: 34,
    gender: "Female",
    bloodType: "O+",
    insurance: "BlueCross",
    medicalHistory: ["Hypertension"],
    allergies: ["Penicillin"],
    location: "San Francisco, CA"
  };

  useEffect(() => {
    loadAIRecommendations();
  }, []);

  const loadAIRecommendations = async () => {
    if (!aiHealthService.hasApiKey()) {
      // Show fallback recommendations
      setAiRecommendations([
        { type: "Provider", text: "Configure AI to get personalized provider recommendations", rating: "Setup Required" },
        { type: "Habit", text: "Configure AI to get personalized lifestyle suggestions", impact: "Setup Required" },
        { type: "Insurance", text: "Configure AI to get insurance optimization tips", savings: "Setup Required" },
      ]);
      return;
    }

    setIsLoadingAI(true);
    try {
      const recommendations = await aiHealthService.generateHealthRecommendations(patientProfile);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGetMoreRecommendations = () => {
    if (!aiHealthService.hasApiKey()) {
      setShowAISetup(true);
    } else {
      loadAIRecommendations();
    }
  };

  const handleAISetupComplete = () => {
    loadAIRecommendations();
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">Manage your health records securely with AI-powered insights</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card variant="medical" className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Dr. Jane Smith</CardTitle>
                  <CardDescription>Patient ID: HL-2024-001</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">34 years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Blood Type</p>
                  <p className="font-medium">O+</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Insurance</p>
                  <p className="font-medium">BlueCross</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency</p>
                  <p className="font-medium">John Smith</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <div className="lg:col-span-2">
            <FileUpload onFileUpload={(files) => {
              console.log('Uploaded files:', files);
              // Here you would typically send files to your backend
            }} />
          </div>

          {/* AI Assistant */}
          <Card variant="feature" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-secondary" />
                AI Health Assistant
              </CardTitle>
              <CardDescription>Personalized recommendations based on your health profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gradient-card rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {rec.type}
                      </Badge>
                      {rec.type === "Provider" && <MapPin className="w-4 h-4 text-muted-foreground" />}
                      {rec.type === "Habit" && <Activity className="w-4 h-4 text-muted-foreground" />}
                      {rec.type === "Insurance" && <CreditCard className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <p className="text-sm font-medium mb-1">{rec.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {rec.rating || rec.impact || rec.savings}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="medical" 
                  className="flex-1" 
                  onClick={handleGetMoreRecommendations}
                  disabled={isLoadingAI}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {isLoadingAI ? "Generating..." : aiHealthService.hasApiKey() ? "Get More Recommendations" : "Setup AI Assistant"}
                </Button>
                {aiHealthService.hasApiKey() && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAISetup(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Generator */}
          <div className="lg:col-span-1">
            <QRGenerator patientId="HL-2024-001" />
          </div>

          {/* Health Metrics */}
          <Card variant="medical" className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Health Metrics Overview
              </CardTitle>
              <CardDescription>Your health trends and key indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="w-full h-48 bg-gradient-card rounded-lg flex items-center justify-center"
                style={{
                  backgroundImage: `url(${dashboardPreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="glass p-6 rounded-lg">
                  <p className="text-sm font-medium">Health Score: 87/100</p>
                  <p className="text-xs text-muted-foreground">Based on recent records and AI analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AISetupModal 
        open={showAISetup}
        onOpenChange={setShowAISetup}
        onSetupComplete={handleAISetupComplete}
      />
    </div>
  );
};

export default Dashboard;