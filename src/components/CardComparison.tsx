import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Copy, CheckCircle, TrendingUp, Gift, Shield } from "lucide-react";
import { GeminiService } from "@/services/geminiService";

interface CardComparisonProps {
  userEmail: string;
}

interface ComparisonResult {
  vendorCard: {
    name: string;
    bank: string;
    features: string[];
    fees: string;
    cashback: string;
    rewards: string;
    limits: string;
  };
  customerCard: {
    name: string;
    bank: string;
    features: string[];
    fees: string;
    cashback: string;
    rewards: string;
    limits: string;
  };
  salesPitch: string;
}

const VENDOR_CARDS = [
  "Kotak White Credit Card",
  "Kotak Royale Signature Credit Card", 
  "HDFC Regalia Credit Card",
  "HDFC Diners Club Black",
  "ICICI Amazon Pay Credit Card",
  "ICICI Emeralde Credit Card",
  "SBI Elite Credit Card",
  "Axis Bank Magnus Credit Card",
  "American Express Platinum Card"
];

const CUSTOMER_CARDS = [
  "HDFC Regalia Credit Card",
  "ICICI Amazon Pay Credit Card", 
  "SBI SimplyCLICK Credit Card",
  "Axis Bank Neo Credit Card",
  "Kotak 811 Credit Card",
  "Standard Chartered Ultimate Credit Card",
  "CitiBank Rewards Credit Card",
  "HSBC Cashback Credit Card",
  "PNB RuPay Select Credit Card",
  "BOB Premier Credit Card"
];

export const CardComparison = ({ userEmail }: CardComparisonProps) => {
  const [vendorCard, setVendorCard] = useState("");
  const [customerCard, setCustomerCard] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const { toast } = useToast();

  const generateComparison = async () => {
    if (!vendorCard || !customerCard) {
      toast({
        title: "Missing Information",
        description: "Please select both vendor and customer cards.",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);

    try {
      // Call Gemini API for real comparison
      const result = await GeminiService.generateCardComparison(vendorCard, customerCard);
      setComparisonResult(result);
      toast({
        title: "Comparison Complete!",
        description: "AI analysis and sales pitch generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsComparing(false);
    }
  };

  const copyPitchToClipboard = () => {
    if (comparisonResult?.salesPitch) {
      navigator.clipboard.writeText(comparisonResult.salesPitch);
      toast({
        title: "Copied!",
        description: "Sales pitch copied to clipboard.",
      });
    }
  };

  const resetComparison = () => {
    setComparisonResult(null);
    setVendorCard("");
    setCustomerCard("");
  };

  if (comparisonResult) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Card Comparison Results</h1>
            <p className="text-muted-foreground">AI-powered analysis and sales strategy</p>
          </div>

          {/* Comparison Table */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Vendor Card */}
            <Card className="border-primary/20 shadow-card">
              <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Your Card (Vendor)
                </CardTitle>
                <CardDescription className="text-white/80">
                  {comparisonResult.vendorCard.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-primary" />
                    Features
                  </h4>
                  <div className="space-y-1">
                    {comparisonResult.vendorCard.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="mr-2 mb-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Annual Fee</p>
                    <p className="font-semibold">{comparisonResult.vendorCard.fees}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Cashback</p>
                    <p className="font-semibold text-secondary">{comparisonResult.vendorCard.cashback}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Rewards</p>
                    <p className="font-semibold">{comparisonResult.vendorCard.rewards}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Credit Limit</p>
                    <p className="font-semibold">{comparisonResult.vendorCard.limits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card className="shadow-card">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-5 w-5" />
                  Customer's Current Card
                </CardTitle>
                <CardDescription>
                  {comparisonResult.customerCard.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    Features
                  </h4>
                  <div className="space-y-1">
                    {comparisonResult.customerCard.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="mr-2 mb-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Annual Fee</p>
                    <p className="font-semibold">{comparisonResult.customerCard.fees}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Cashback</p>
                    <p className="font-semibold">{comparisonResult.customerCard.cashback}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Rewards</p>
                    <p className="font-semibold">{comparisonResult.customerCard.rewards}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Credit Limit</p>
                    <p className="font-semibold">{comparisonResult.customerCard.limits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Sales Pitch */}
          <Card className="shadow-card-hover border-accent/20">
            <CardHeader className="bg-gradient-success text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Generated Sales Pitch
              </CardTitle>
              <CardDescription className="text-white/80">
                Personalized conversation script to convince the customer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <pre className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
                  {comparisonResult.salesPitch}
                </pre>
              </div>
              <div className="flex gap-3">
                <Button onClick={copyPitchToClipboard} variant="secondary" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={resetComparison} variant="outline">
                  New Comparison
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Card Comparison Tool</h1>
          <p className="text-muted-foreground">Compare credit cards and get AI-powered sales insights</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Signed in as {userEmail}</span>
          </div>
        </div>

        {/* Comparison Form */}
        <Card className="shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Start Comparison
            </CardTitle>
            <CardDescription>
              Select the cards to compare and get personalized sales strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vendor-card">Your Card (The one you're selling)</Label>
              <Select value={vendorCard} onValueChange={setVendorCard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your vendor card" />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_CARDS.map((card) => (
                    <SelectItem key={card} value={card}>
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-card">Customer's Current Card</Label>
              <Select value={customerCard} onValueChange={setCustomerCard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer's current card" />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_CARDS.map((card) => (
                    <SelectItem key={card} value={card}>
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateComparison}
              disabled={isComparing || !vendorCard || !customerCard}
              variant="primary"
              className="w-full"
            >
              {isComparing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Compare Cards & Generate Pitch
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};