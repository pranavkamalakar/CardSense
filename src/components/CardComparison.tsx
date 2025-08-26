import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Copy, CheckCircle, TrendingUp, Gift, Shield, LogOut } from "lucide-react";
import { GeminiService } from "@/services/geminiService";

interface CardComparisonProps {
  userEmail: string;
  onLogout: () => void;
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

export const CardComparison = ({ userEmail, onLogout }: CardComparisonProps) => {
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
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-center mt-8 mb-2">Transform Your Home Buying Experience</h1>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl">
            See how we've revolutionized the traditional home buying process to eliminate stress and maximize satisfaction
          </p>
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
            <div className="flex-1 bg-red-50 rounded-xl shadow p-8">
              <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold mb-4">✖ Traditional Home Buying</span>
              <h2 className="text-xl font-bold text-red-600 mb-2">Frustrating Pain Points</h2>
              <p className="text-sm text-red-500 mb-6">The typical home buying experience is filled with stress and uncertainty</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 bg-red-100 rounded-md p-3">
                  <span>🔍</span> Endless property searches with no clear direction
                </li>
                <li className="flex items-center gap-2 bg-red-100 rounded-md p-3">
                  <span>💸</span> Hidden costs and unexpected fees
                </li>
                <li className="flex items-center gap-2 bg-red-100 rounded-md p-3">
                  <span>📞</span> Unreliable agents who disappear
                </li>
                <li className="flex items-center gap-2 bg-red-100 rounded-md p-3">
                  <span>⚠️</span> Stressful negotiations and paperwork
                </li>
                <li className="flex items-center gap-2 bg-red-100 rounded-md p-3">
                  <span>⏳</span> Wasted time on unsuitable properties
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-green-50 rounded-xl shadow p-8">
              <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold mb-4">✔ Our Solution</span>
              <h2 className="text-xl font-bold text-green-600 mb-2">Stress-Free Experience</h2>
              <p className="text-sm text-green-500 mb-6">We've reimagined home buying to be smooth, transparent, and enjoyable</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 bg-green-100 rounded-md p-3">
                  <span>✅</span> Curated property matches based on your needs
                </li>
                <li className="flex items-center gap-2 bg-green-100 rounded-md p-3">
                  <span>🛡️</span> Transparent pricing with no hidden fees
                </li>
                <li className="flex items-center gap-2 bg-green-100 rounded-md p-3">
                  <span>🧑‍💼</span> Dedicated expert support throughout
                </li>
                <li className="flex items-center gap-2 bg-green-100 rounded-md p-3">
                  <span>📄</span> Streamlined process and documentation
                </li>
                <li className="flex items-center gap-2 bg-green-100 rounded-md p-3">
                  <span>🏡</span> Pre-screened, quality properties only
                </li>
              </ul>
              <button className="mt-6 w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition">
                Book Site Visit
              </button>
              <p className="mt-4 text-green-600 text-center text-sm">
                Start your stress-free home buying journey today
              </p>
            </div>
          </div>
        </div>
      );
    }
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with Logout */}
          <div className="flex justify-between items-center mb-6">
            <div className={`text-center flex-1 transition-all duration-700 ${showResults ? 'animate-fade-in' : 'opacity-0 -translate-y-8'}`}>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Card Comparison Results
              </h1>
              <p className="text-lg text-muted-foreground font-medium">AI-powered analysis and sales strategy</p>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Comparison Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Vendor Card */}
            <div className={`transition-all duration-1000 delay-200 ${showResults ? 'animate-fade-in translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} hover:scale-105 hover:shadow-card-hover`}>
              <Card className="h-full shadow-card rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <CardHeader className="bg-gradient-primary text-primary-foreground relative overflow-hidden p-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <CreditCard className="h-6 w-6" />
                    Your Card (Vendor)
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-base font-medium">
                    {comparisonResult.vendorCard.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-card-foreground">
                      <Gift className="h-5 w-5 text-primary" />
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {comparisonResult.vendorCard.features.map((feature, idx) => (
                        <Badge key={idx} className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors rounded-full">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Annual Fee</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.vendorCard.fees}</p>
                    </div>
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Cashback</p>
                      <p className="font-bold text-lg text-secondary">{comparisonResult.vendorCard.cashback}</p>
                    </div>
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Rewards</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.vendorCard.rewards}</p>
                    </div>
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Credit Limit</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.vendorCard.limits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Card */}
            <div className={`transition-all duration-1000 delay-400 ${showResults ? 'animate-fade-in translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} hover:scale-105 hover:shadow-card-hover`}>
              <Card className="h-full shadow-card rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/50 border border-muted/50">
                <CardHeader className="bg-gradient-to-r from-muted to-muted-foreground/20 text-card-foreground relative overflow-hidden p-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <CreditCard className="h-6 w-6" />
                    Customer's Current Card
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base font-medium">
                    {comparisonResult.customerCard.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-card-foreground">
                      <Gift className="h-5 w-5 text-muted-foreground" />
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {comparisonResult.customerCard.features.map((feature, idx) => (
                        <Badge key={idx} className="px-3 py-1 text-xs font-semibold bg-muted/60 text-muted-foreground border-muted hover:bg-muted transition-colors rounded-full">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Annual Fee</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.customerCard.fees}</p>
                    </div>
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Cashback</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.customerCard.cashback}</p>
                    </div>
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Rewards</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.customerCard.rewards}</p>
                    </div>
                    <div className="bg-card/60 rounded-xl p-3 space-y-1 border border-border/50">
                      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">Credit Limit</p>
                      <p className="font-bold text-lg text-card-foreground">{comparisonResult.customerCard.limits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Sales Pitch */}
          <div className={`transition-all duration-1000 delay-600 ${showResults ? 'animate-fade-in translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <Card className={`shadow-card rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 ${isTyping ? 'animate-pulse' : ''} ${!isTyping && showResults ? 'shadow-card-hover' : ''}`}>
              <CardHeader className="bg-gradient-success text-secondary-foreground relative overflow-hidden p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <TrendingUp className="h-6 w-6" />
                  AI-Generated Sales Pitch
                </CardTitle>
                <CardDescription className="text-secondary-foreground/80 text-base font-medium">
                  Personalized conversation script to convince the customer
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-card/70 rounded-xl p-6 mb-6 border border-border/50 backdrop-blur-sm">
                  <div ref={typewriterRef} className="whitespace-pre-wrap text-base font-medium leading-relaxed text-card-foreground min-h-[100px]">
                    {!isTyping && comparisonResult.salesPitch}
                  </div>
                  {isTyping && (
                    <div className="inline-block w-1 h-5 bg-secondary animate-pulse ml-1 rounded-full"></div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={copyPitchToClipboard} 
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${copied ? 'bg-secondary/90 scale-105' : 'bg-secondary hover:bg-secondary/90'} text-secondary-foreground hover:scale-105 hover:shadow-card`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={resetComparison} 
                    variant="outline"
                    className="py-3 px-6 rounded-xl font-semibold border border-border text-card-foreground hover:bg-muted hover:scale-105 transition-all duration-300 hover:shadow-card"
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Card Comparison Tool
            </h1>
            <p className="text-lg text-muted-foreground mb-6 font-medium">Compare credit cards and get AI-powered sales insights</p>
            <div className="flex items-center justify-center gap-3 text-base text-muted-foreground bg-card/70 backdrop-blur-sm rounded-full px-6 py-3 w-fit mx-auto shadow-card border border-border/50">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Signed in as {userEmail}</span>
            </div>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:scale-105 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Comparison Form */}
        <Card className="shadow-card rounded-2xl border border-border/50 overflow-hidden backdrop-blur-sm bg-card/80 animate-fade-in delay-200">
          <CardHeader className="bg-gradient-primary text-primary-foreground p-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <CreditCard className="h-6 w-6" />
              Start Comparison
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 text-base font-medium">
              Select the cards to compare and get personalized sales strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6 bg-gradient-to-br from-card to-muted/20">
            <div className="space-y-3">
              <Label htmlFor="vendor-card" className="text-lg font-bold text-card-foreground">
                Your Card (The one you're selling)
              </Label>
              <Select value={vendorCard} onValueChange={setVendorCard}>
                <SelectTrigger className="h-12 text-base rounded-xl border border-border hover:border-primary transition-all duration-300 bg-card/70 backdrop-blur-sm shadow-card">
                  <SelectValue placeholder="Select your vendor card" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border shadow-card bg-card/95 backdrop-blur-sm">
                  {VENDOR_CARDS.map((card) => (
                    <SelectItem key={card} value={card} className="text-base py-3 rounded-lg hover:bg-muted">
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="customer-card" className="text-lg font-bold text-card-foreground">
                Customer's Current Card
              </Label>
              <Select value={customerCard} onValueChange={setCustomerCard}>
                <SelectTrigger className="h-12 text-base rounded-xl border border-border hover:border-primary transition-all duration-300 bg-card/70 backdrop-blur-sm shadow-card">
                  <SelectValue placeholder="Select customer's current card" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border shadow-card bg-card/95 backdrop-blur-sm">
                  {CUSTOMER_CARDS.map((card) => (
                    <SelectItem key={card} value={card} className="text-base py-3 rounded-lg hover:bg-muted">
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateComparison}
              disabled={isComparing || !vendorCard || !customerCard}
              className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-card hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isComparing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-3" />
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