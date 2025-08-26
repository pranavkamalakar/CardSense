import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
// import { CardComparison } from "@/components/CardComparison";

interface User {
  email: string;
  name: string;
}

import CardComparison from "../components/CardComparison";

const Index = () => {
  return (
    <div>
      <CardComparison />
    </div>
  );
};

export default Index;
