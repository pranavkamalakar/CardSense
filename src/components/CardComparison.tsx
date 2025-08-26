import { useState, useEffect, useRef } from "react";
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
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const typewriterRef = useRef<HTMLDivElement>(null);

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
    setShowResults(false);

    try {
      // Call Gemini API for real comparison
      const result = await GeminiService.generateCardComparison(vendorCard, customerCard);
      setComparisonResult(result);
      
      // Show results with delay for animation
      setTimeout(() => {
        setShowResults(true);
        // Start typewriter effect after cards appear
        setTimeout(() => {
          startTypewriterEffect();
        }, 800);
      }, 100);
      
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

  const startTypewriterEffect = () => {
    if (!typewriterRef.current || !comparisonResult?.salesPitch) return;
    
    setIsTyping(true);
    const text = comparisonResult.salesPitch;
    typewriterRef.current.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        typewriterRef.current!.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 30);
  };

  const copyPitchToClipboard = () => {
    if (comparisonResult?.salesPitch) {
      navigator.clipboard.writeText(comparisonResult.salesPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
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
    setIsTyping(false);
    setShowResults(false);
    setCopied(false);
  };


  if (comparisonResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className={`text-center transition-all duration-700 ${showResults ? 'animate-fade-in' : 'opacity-0 -translate-y-8'}`}>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Card Comparison Results
            </h1>
            <p className="text-xl text-gray-600 font-medium">AI-powered analysis and sales strategy</p>
          </div>

          {/* Comparison Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Vendor Card */}
            <div className={`transition-all duration-1000 delay-200 ${showResults ? 'animate-fade-in translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} hover:scale-105 hover:shadow-2xl`}>
              <Card className="h-full border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold relative z-10">
                    <CreditCard className="h-7 w-7" />
                    Your Card (Vendor)
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg font-medium relative z-10">
                    {comparisonResult.vendorCard.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h4 className="font-bold mb-4 flex items-center gap-2 text-xl text-blue-800">
                      <Gift className="h-6 w-6 text-blue-600" />
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {comparisonResult.vendorCard.features.map((feature, idx) => (
                        <Badge key={idx} className="px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 transition-colors rounded-full">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Annual Fee</p>
                      <p className="font-bold text-xl text-blue-700">{comparisonResult.vendorCard.fees}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Cashback</p>
                      <p className="font-bold text-xl text-green-600">{comparisonResult.vendorCard.cashback}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Rewards</p>
                      <p className="font-bold text-xl text-blue-700">{comparisonResult.vendorCard.rewards}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Credit Limit</p>
                      <p className="font-bold text-xl text-blue-700">{comparisonResult.vendorCard.limits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Card */}
            <div className={`transition-all duration-1000 delay-400 ${showResults ? 'animate-fade-in translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} hover:scale-105 hover:shadow-2xl`}>
              <Card className="h-full border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200/50">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold relative z-10">
                    <CreditCard className="h-7 w-7" />
                    Customer's Current Card
                  </CardTitle>
                  <CardDescription className="text-gray-100 text-lg font-medium relative z-10">
                    {comparisonResult.customerCard.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h4 className="font-bold mb-4 flex items-center gap-2 text-xl text-gray-800">
                      <Gift className="h-6 w-6 text-gray-600" />
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {comparisonResult.customerCard.features.map((feature, idx) => (
                        <Badge key={idx} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 transition-colors rounded-full">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Annual Fee</p>
                      <p className="font-bold text-xl text-gray-700">{comparisonResult.customerCard.fees}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Cashback</p>
                      <p className="font-bold text-xl text-gray-700">{comparisonResult.customerCard.cashback}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Rewards</p>
                      <p className="font-bold text-xl text-gray-700">{comparisonResult.customerCard.rewards}</p>
                    </div>
                    <div className="bg-white/60 rounded-2xl p-4 space-y-2">
                      <p className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Credit Limit</p>
                      <p className="font-bold text-xl text-gray-700">{comparisonResult.customerCard.limits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Sales Pitch */}
          <div className={`transition-all duration-1000 delay-600 ${showResults ? 'animate-fade-in translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <Card className={`border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 ${isTyping ? 'animate-pulse' : ''} ${!isTyping && showResults ? 'shadow-green-200/50 shadow-2xl' : ''}`}>
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-pulse"></div>
                </div>
                <CardTitle className="flex items-center gap-3 text-2xl font-bold relative z-10">
                  <TrendingUp className="h-7 w-7" />
                  AI-Generated Sales Pitch
                </CardTitle>
                <CardDescription className="text-green-100 text-lg font-medium relative z-10">
                  Personalized conversation script to convince the customer
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-white/70 rounded-2xl p-8 mb-8 border-2 border-green-200/50 backdrop-blur-sm">
                  <div ref={typewriterRef} className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-gray-800 min-h-[120px]">
                    {!isTyping && comparisonResult.salesPitch}
                  </div>
                  {isTyping && (
                    <div className="inline-block w-1 h-6 bg-green-600 animate-pulse ml-1 rounded-full"></div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={copyPitchToClipboard} 
                    className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${copied ? 'bg-green-700 scale-110' : 'bg-green-600 hover:bg-green-700'} text-white hover:scale-105 hover:shadow-xl`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-6 w-6 mr-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-6 w-6 mr-3" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={resetComparison} 
                    variant="outline"
                    className="py-4 px-8 rounded-2xl font-bold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  >
                    New Comparison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Card Comparison Tool
          </h1>
          <p className="text-2xl text-gray-600 mb-8 font-medium">Compare credit cards and get AI-powered sales insights</p>
          <div className="flex items-center justify-center gap-3 text-lg text-gray-700 bg-white/70 backdrop-blur-sm rounded-full px-8 py-4 w-fit mx-auto shadow-lg border border-gray-200/50">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="font-semibold">Signed in as {userEmail}</span>
          </div>
        </div>

        {/* Comparison Form */}
        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden backdrop-blur-sm bg-white/80 animate-fade-in delay-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
            <CardTitle className="flex items-center gap-4 text-3xl font-bold">
              <CreditCard className="h-8 w-8" />
              Start Comparison
            </CardTitle>
            <CardDescription className="text-blue-100 text-xl font-medium">
              Select the cards to compare and get personalized sales strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8 bg-gradient-to-br from-white to-blue-50/30">
            <div className="space-y-4">
              <Label htmlFor="vendor-card" className="text-xl font-bold text-gray-800">
                Your Card (The one you're selling)
              </Label>
              <Select value={vendorCard} onValueChange={setVendorCard}>
                <SelectTrigger className="h-16 text-lg rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-lg">
                  <SelectValue placeholder="Select your vendor card" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                  {VENDOR_CARDS.map((card) => (
                    <SelectItem key={card} value={card} className="text-lg py-4 rounded-xl hover:bg-blue-50">
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="customer-card" className="text-xl font-bold text-gray-800">
                Customer's Current Card
              </Label>
              <Select value={customerCard} onValueChange={setCustomerCard}>
                <SelectTrigger className="h-16 text-lg rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-lg">
                  <SelectValue placeholder="Select customer's current card" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                  {CUSTOMER_CARDS.map((card) => (
                    <SelectItem key={card} value={card} className="text-lg py-4 rounded-xl hover:bg-gray-50">
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateComparison}
              disabled={isComparing || !vendorCard || !customerCard}
              className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isComparing ? (
                <>
                  <Loader2 className="h-7 w-7 mr-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <TrendingUp className="h-7 w-7 mr-4" />
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