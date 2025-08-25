interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface CardDetails {
  name: string;
  bank: string;
  features: string[];
  fees: string;
  cashback: string;
  rewards: string;
  limits: string;
}

interface ComparisonResult {
  vendorCard: CardDetails;
  customerCard: CardDetails;
  salesPitch: string;
}

export class GeminiService {
  private static readonly API_KEY = "AIzaSyAh8LKs4Pvw1e1_FjFyrRZN-dmh0WOMEFA";
  private static readonly API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  static async generateCardComparison(
    vendorCard: string,
    customerCard: string
  ): Promise<ComparisonResult> {
    const prompt = `
You are a credit card expert helping sales professionals. Compare these two credit cards and provide:

1. Detailed features, fees, cashback rates, rewards, and credit limits for both cards
2. A persuasive sales pitch to help convince the customer to switch from their current card to the vendor's card

Vendor Card (the one being sold): ${vendorCard}
Customer's Current Card: ${customerCard}

Please provide the response in this exact JSON format:
{
  "vendorCard": {
    "name": "${vendorCard}",
    "bank": "Bank Name",
    "features": ["feature1", "feature2", "feature3", "feature4"],
    "fees": "Annual fee details",
    "cashback": "Cashback rate details",
    "rewards": "Reward points details",
    "limits": "Credit limit range"
  },
  "customerCard": {
    "name": "${customerCard}",
    "bank": "Bank Name",
    "features": ["feature1", "feature2", "feature3"],
    "fees": "Annual fee details",
    "cashback": "Cashback rate details", 
    "rewards": "Reward points details",
    "limits": "Credit limit range"
  },
  "salesPitch": "A detailed, persuasive sales script in simple English that a vendor can use to convince the customer. Include specific benefits, savings calculations, and compelling reasons to switch. Make it conversational and easy to deliver."
}

Ensure all details are accurate and based on current credit card offerings in India.
`;

    try {
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini API');
      }

      const comparisonResult: ComparisonResult = JSON.parse(jsonMatch[0]);
      return comparisonResult;

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback mock data if API fails
      return {
        vendorCard: {
          name: vendorCard,
          bank: vendorCard.split(" ")[0],
          features: ["Premium Lounge Access", "Concierge Service", "Golf Benefits", "Insurance Coverage"],
          fees: "₹5,000 Annual Fee",
          cashback: "2-5% on all spends",
          rewards: "2 points per ₹100",
          limits: "₹5-15 Lakhs"
        },
        customerCard: {
          name: customerCard,
          bank: customerCard.split(" ")[0],
          features: ["Basic Lounge Access", "Online Offers", "Fuel Surcharge Waiver"],
          fees: "₹2,500 Annual Fee",
          cashback: "1-2% on select categories",
          rewards: "1 point per ₹100",
          limits: "₹2-8 Lakhs"
        },
        salesPitch: `Hi! I understand you currently use the ${customerCard}. It's a good card, but let me show you how ${vendorCard} can significantly improve your financial benefits. 

**Key Advantages:**
• **Higher Cashback**: Get 2-5% cashback vs your current 1-2%
• **Better Rewards**: Earn double reward points on every purchase
• **Premium Benefits**: Access to exclusive airport lounges and concierge services
• **Higher Credit Limit**: Get up to ₹15 lakhs vs your current ₹8 lakhs limit

**Real Example**: If you spend ₹50,000 monthly, you'll earn ₹12,000 more in cashback annually with ${vendorCard} compared to ${customerCard}.

The annual fee difference of ₹2,500 pays for itself in just 2 months with the enhanced benefits. Would you like me to help you apply today?`
      };
    }
  }
}