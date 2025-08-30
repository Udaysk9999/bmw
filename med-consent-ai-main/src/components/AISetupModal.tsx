import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Key } from "lucide-react";
import { aiHealthService } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";

interface AISetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete: () => void;
}

export const AISetupModal = ({ open, onOpenChange, onSetupComplete }: AISetupModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      aiHealthService.setApiKey(apiKey);
      toast({
        title: "AI Setup Complete",
        description: "Your AI health assistant is now ready to provide recommendations.",
      });
      onSetupComplete();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to configure AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" />
            AI Health Assistant Setup
          </DialogTitle>
          <DialogDescription>
            Configure your AI health assistant to get personalized recommendations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never shared. Get one from{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Demo API Key:</strong> For testing purposes, you can use: <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">sk-demo123456789</code>
                <br />
                <em>Note: This is not a real API key. Get a real one from OpenAI for actual functionality.</em>
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg border border-primary/10">
            <h4 className="font-medium text-sm mb-2">Features you'll unlock:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Personalized healthcare provider recommendations</li>
              <li>• Custom lifestyle and wellness suggestions</li>
              <li>• Insurance optimization recommendations</li>
              <li>• AI-powered health insights based on your profile</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Skip for Now
            </Button>
            <Button 
              variant="hero" 
              onClick={handleSetup} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Setting up..." : "Setup AI Assistant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};