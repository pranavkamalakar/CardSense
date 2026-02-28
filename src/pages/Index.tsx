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
    return (
      <>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
        <p className="text-center text-sm text-muted-foreground py-4">Made by Pranav Kamalakar</p>
      </>
    );
  }

  return (
    <div>
      <CardComparison userEmail={user.email} onLogout={handleLogout} />
      <p className="text-center text-sm text-muted-foreground py-4">Made by Pranav Kamalakar</p>
    </div>
  );
};

export default Index;
