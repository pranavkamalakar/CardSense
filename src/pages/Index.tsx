import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { CardComparison } from "@/components/CardComparison";

interface User {
  email: string;
  name: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return <CardComparison userEmail={user.email} />;
};

export default Index;
