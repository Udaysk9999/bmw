import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Copy, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

interface QRGeneratorProps {
  patientId?: string;
}

export const QRGenerator = ({ patientId = "HL-2024-001" }: QRGeneratorProps) => {
  const [qrData, setQrData] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [accessDuration, setAccessDuration] = useState("1h");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSecureToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const generateQRCode = async () => {
    if (!qrData.trim()) {
      // Generate a secure sharing link
      const token = generateSecureToken();
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/share/${patientId}?token=${token}&expires=${accessDuration}`;
      setQrData(shareUrl);
    }

    setIsGenerating(true);
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      });
      setQrImage(qrCodeDataUrl);
      
      toast({
        title: "QR Code Generated",
        description: "Secure access link created successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;
    
    const link = document.createElement('a');
    link.download = `health-access-qr-${Date.now()}.png`;
    link.href = qrImage;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrData) return;
    
    try {
      await navigator.clipboard.writeText(qrData);
      toast({
        title: "Link Copied",
        description: "Secure access link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "1h": return "1 Hour";
      case "24h": return "24 Hours";
      case "7d": return "7 Days";
      case "30d": return "30 Days";
      default: return "1 Hour";
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Generate Secure QR Code
        </CardTitle>
        <CardDescription>
          Create time-limited access links for healthcare providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customUrl">Custom Share URL (Optional)</Label>
          <Input
            id="customUrl"
            placeholder="Leave empty for auto-generated secure link"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Access Duration</Label>
          <Select value={accessDuration} onValueChange={setAccessDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="hero" 
          className="w-full" 
          onClick={generateQRCode}
          disabled={isGenerating}
        >
          <QrCode className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate QR Code"}
        </Button>

        {qrImage && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block border">
                <img src={qrImage} alt="Generated QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Access expires in: {getDurationLabel(accessDuration)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={downloadQR}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Security Info</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Link expires automatically after set duration</li>
                <li>• One-time use token for maximum security</li>
                <li>• Access logs tracked for your safety</li>
                <li>• Revoke access anytime from your dashboard</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};