import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
        <p className="text-white/80">Loading CardAssist Pro...</p>
      </div>
    </div>
  );
};