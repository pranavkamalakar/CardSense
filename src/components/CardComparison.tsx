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
import anime from 'animejs';

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
  const { toast } = useToast();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
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

    try {
      // Call Gemini API for real comparison
      const result = await GeminiService.generateCardComparison(vendorCard, customerCard);
      setComparisonResult(result);
      
      // Animate results appearance
      setTimeout(() => {
        animateResultsIn();
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

  const animateResultsIn = () => {
    // Animate header
    anime({
      targets: headerRef.current,
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 600,
      easing: 'easeOutCubic'
    });

    // Animate comparison cards
    anime({
      targets: cardsRef.current?.children,
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.9, 1],
      duration: 800,
      delay: anime.stagger(200),
      easing: 'easeOutCubic'
    });

    // Animate sales pitch with delay
    setTimeout(() => {
      anime({
        targets: pitchRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 600,
        easing: 'easeOutCubic',
        complete: () => {
          startTypewriterEffect();
        }
      });
    }, 1000);
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
        
        // Add glow effect
        anime({
          targets: pitchRef.current,
          boxShadow: [
            '0 0 20px rgba(34, 197, 94, 0.2)',
            '0 0 30px rgba(34, 197, 94, 0.4)',
            '0 0 20px rgba(34, 197, 94, 0.2)'
          ],
          duration: 2000,
          loop: 3,
          direction: 'alternate',
          easing: 'easeInOutSine'
        });
      }
    }, 30);
  };

  const copyPitchToClipboard = () => {
    if (comparisonResult?.salesPitch) {
      navigator.clipboard.writeText(comparisonResult.salesPitch);
      
      // Bounce animation for copy confirmation
      anime({
        targets: '.copy-button',
        scale: [1, 1.1, 1],
        duration: 300,
        easing: 'easeOutBounce'
      });
      
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
  };

  useEffect(() => {
    if (!comparisonResult && formRef.current) {
      // Animate form on mount
      anime({
        targets: formRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutCubic'
      });
    }
  }, [comparisonResult]);

  if (comparisonResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div ref={headerRef} className="text-center opacity-0">
            <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-primary bg-clip-text text-transparent">
              Card Comparison Results
            </h1>
            <p className="text-lg text-muted-foreground">AI-powered analysis and sales strategy</p>
          </div>

          {/* Comparison Table */}
          <div ref={cardsRef} className="grid lg:grid-cols-2 gap-8">
            {/* Vendor Card */}
            <Card className="border-primary/30 shadow-card-hover hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer rounded-2xl overflow-hidden opacity-0">
              <CardHeader className="bg-gradient-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardTitle className="flex items-center gap-3 text-xl relative z-10">
                  <CreditCard className="h-6 w-6" />
                  Your Card (Vendor)
                </CardTitle>
                <CardDescription className="text-white/90 text-base relative z-10">
                  {comparisonResult.vendorCard.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-gradient-to-br from-white to-primary/5">
                <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <Gift className="h-5 w-5 text-primary" />
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonResult.vendorCard.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Annual Fee</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.vendorCard.fees}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Cashback</p>
                    <p className="font-bold text-lg text-secondary">{comparisonResult.vendorCard.cashback}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Rewards</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.vendorCard.rewards}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Credit Limit</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.vendorCard.limits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card className="border-muted-foreground/20 shadow-card-hover hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer rounded-2xl overflow-hidden opacity-0">
              <CardHeader className="bg-gradient-to-br from-muted to-muted/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardTitle className="flex items-center gap-3 text-xl text-muted-foreground relative z-10">
                  <CreditCard className="h-6 w-6" />
                  Customer's Current Card
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 text-base relative z-10">
                  {comparisonResult.customerCard.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-gradient-to-br from-white to-muted/10">
                <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <Gift className="h-5 w-5 text-muted-foreground" />
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonResult.customerCard.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="px-3 py-1 text-sm font-medium bg-muted/20 text-muted-foreground border-muted-foreground/30 hover:bg-muted/40 transition-colors">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Annual Fee</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.customerCard.fees}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Cashback</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.customerCard.cashback}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Rewards</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.customerCard.rewards}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Credit Limit</p>
                    <p className="font-bold text-lg text-foreground">{comparisonResult.customerCard.limits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Sales Pitch */}
          <Card ref={pitchRef} className="shadow-card-hover border-secondary/30 rounded-2xl overflow-hidden opacity-0">
            <CardHeader className="bg-gradient-success text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <CardTitle className="flex items-center gap-3 text-xl relative z-10">
                <TrendingUp className="h-6 w-6" />
                AI-Generated Sales Pitch
              </CardTitle>
              <CardDescription className="text-white/90 text-base relative z-10">
                Personalized conversation script to convince the customer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 bg-gradient-to-br from-white to-secondary/5">
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 mb-6 border border-secondary/20">
                <div ref={typewriterRef} className="whitespace-pre-wrap text-base font-medium leading-relaxed text-foreground min-h-[100px]">
                  {!isTyping && comparisonResult.salesPitch}
                </div>
                {isTyping && (
                  <div className="inline-block w-0.5 h-5 bg-secondary animate-pulse ml-1"></div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={copyPitchToClipboard} 
                  variant="secondary" 
                  className="copy-button flex-1 py-3 px-6 rounded-xl font-semibold text-base hover:scale-105 transition-all duration-200 bg-secondary hover:bg-secondary/90"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button 
                  onClick={resetComparison} 
                  variant="outline"
                  className="py-3 px-6 rounded-xl font-semibold text-base hover:scale-105 transition-all duration-200 border-2"
                >
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Card Comparison Tool
          </h1>
          <p className="text-xl text-muted-foreground mb-6">Compare credit cards and get AI-powered sales insights</p>
          <div className="flex items-center justify-center gap-3 text-base text-muted-foreground bg-muted/30 rounded-full px-6 py-3 w-fit mx-auto">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">Signed in as {userEmail}</span>
          </div>
        </div>

        {/* Comparison Form */}
        <Card ref={formRef} className="shadow-card-hover rounded-2xl border-primary/20 overflow-hidden opacity-0">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CreditCard className="h-7 w-7 text-primary" />
              Start Comparison
            </CardTitle>
            <CardDescription className="text-base">
              Select the cards to compare and get personalized sales strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8 bg-gradient-to-br from-white to-primary/5">
            <div className="space-y-3">
              <Label htmlFor="vendor-card" className="text-base font-semibold text-foreground">
                Your Card (The one you're selling)
              </Label>
              <Select value={vendorCard} onValueChange={setVendorCard}>
                <SelectTrigger className="h-12 text-base rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <SelectValue placeholder="Select your vendor card" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {VENDOR_CARDS.map((card) => (
                    <SelectItem key={card} value={card} className="text-base py-3">
                      {card}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="customer-card" className="text-base font-semibold text-foreground">
                Customer's Current Card
              </Label>
              <Select value={customerCard} onValueChange={setCustomerCard}>
                <SelectTrigger className="h-12 text-base rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <SelectValue placeholder="Select customer's current card" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CUSTOMER_CARDS.map((card) => (
                    <SelectItem key={card} value={card} className="text-base py-3">
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
              className="w-full h-14 text-lg font-bold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isComparing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <TrendingUp className="h-6 w-6 mr-3" />
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