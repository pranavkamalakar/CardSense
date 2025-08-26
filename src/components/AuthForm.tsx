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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 backdrop-blur-sm p-6 rounded-3xl border border-primary/30 shadow-card">
              <CreditCard className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CardAssist Pro
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Smart Credit Card Sales Assistant</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in delay-200">
          <div className="text-center group">
            <div className="bg-card/60 backdrop-blur-sm p-4 rounded-2xl mb-3 border border-border/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-card">
              <CreditCard className="h-6 w-6 text-primary mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Compare Cards</p>
          </div>
          <div className="text-center group">
            <div className="bg-card/60 backdrop-blur-sm p-4 rounded-2xl mb-3 border border-border/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-card">
              <TrendingUp className="h-6 w-6 text-secondary mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">AI Insights</p>
          </div>
          <div className="text-center group">
            <div className="bg-card/60 backdrop-blur-sm p-4 rounded-2xl mb-3 border border-border/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-card">
              <Shield className="h-6 w-6 text-accent mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Sales Boost</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="backdrop-blur-sm bg-card/80 shadow-card-hover border border-border/50 animate-fade-in delay-300">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-3xl font-bold text-card-foreground">
              {isLogin ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
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
                className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-card hover:shadow-card-hover" 
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