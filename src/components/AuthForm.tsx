import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-cards.jpg";

interface AuthFormProps {
  onAuthSuccess: (userData: { email: string; name: string }) => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: `Successfully ${isLogin ? "logged in" : "signed up"}.`,
      });
      onAuthSuccess({ 
        email, 
        name: name || email.split("@")[0] 
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--secondary) / 0.8)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand Section */}
        <div className="text-center text-white mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">CardAssist Pro</h1>
          <p className="text-white/80">Smart Credit Card Sales Assistant</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-2">
              <CreditCard className="h-5 w-5 text-white mx-auto" />
            </div>
            <p className="text-xs text-white/80">Compare Cards</p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-2">
              <TrendingUp className="h-5 w-5 text-white mx-auto" />
            </div>
            <p className="text-xs text-white/80">AI Insights</p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mb-2">
              <Shield className="h-5 w-5 text-white mx-auto" />
            </div>
            <p className="text-xs text-white/80">Sales Boost</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="backdrop-blur-sm bg-white/95 shadow-card-hover border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to your account to continue" 
                : "Create your account to start comparing cards"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Button 
                type="submit" 
                variant="primary"
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};