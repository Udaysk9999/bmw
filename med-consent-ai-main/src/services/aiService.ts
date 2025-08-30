import { toast } from "@/hooks/use-toast";

export interface HealthRecommendation {
  type: 'Provider' | 'Habit' | 'Insurance';
  text: string;
  rating?: string;
  impact?: string;
  savings?: string;
}

export interface PatientProfile {
  age?: number;
  gender?: string;
  bloodType?: string;
  insurance?: string;
  medicalHistory?: string[];
  allergies?: string[];
  location?: string;
}

export class AIHealthService {
  private apiKey: string | null = null;

  constructor() {
    // In a real app, this would come from environment variables
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generateHealthRecommendations(profile: PatientProfile): Promise<HealthRecommendation[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const prompt = this.buildPrompt(profile);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful healthcare assistant that provides personalized recommendations. Always include disclaimers that these are suggestions only and not medical advice. Format responses as JSON array of recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      return this.parseRecommendations(aiResponse);
    } catch (error) {
      console.error('AI Service Error:', error);
      toast({
        title: "AI Service Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
      return this.getFallbackRecommendations();
    }
  }

  private buildPrompt(profile: PatientProfile): string {
    return `Based on this patient profile, provide 3 personalized healthcare recommendations:

Patient Profile:
- Age: ${profile.age || 'Not specified'}
- Gender: ${profile.gender || 'Not specified'}
- Blood Type: ${profile.bloodType || 'Not specified'}
- Insurance: ${profile.insurance || 'Not specified'}
- Medical History: ${profile.medicalHistory?.join(', ') || 'None specified'}
- Allergies: ${profile.allergies?.join(', ') || 'None specified'}
- Location: ${profile.location || 'Not specified'}

Please provide exactly 3 recommendations in this JSON format:
[
  {
    "type": "Provider",
    "text": "Recommendation text",
    "rating": "4.9★"
  },
  {
    "type": "Habit",
    "text": "Recommendation text",
    "impact": "High"
  },
  {
    "type": "Insurance",
    "text": "Recommendation text",
    "savings": "$X/year"
  }
]

Focus on:
1. A healthcare provider recommendation based on location and medical needs
2. A lifestyle/habit recommendation based on age and health profile
3. An insurance optimization suggestion

Include appropriate disclaimers and ensure recommendations are general wellness suggestions only.`;
  }

  private parseRecommendations(aiResponse: string): HealthRecommendation[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        return recommendations.filter((rec: any) => 
          rec.type && rec.text && ['Provider', 'Habit', 'Insurance'].includes(rec.type)
        );
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }
    
    return this.getFallbackRecommendations();
  }

  private getFallbackRecommendations(): HealthRecommendation[] {
    return [
      { 
        type: "Provider", 
        text: "Consider scheduling annual check-ups with local healthcare providers", 
        rating: "Recommended" 
      },
      { 
        type: "Habit", 
        text: "Maintain regular exercise routine based on your age and health profile", 
        impact: "High" 
      },
      { 
        type: "Insurance", 
        text: "Review your current insurance coverage annually for better options", 
        savings: "Varies" 
      },
    ];
  }
}

export const aiHealthService = new AIHealthService();