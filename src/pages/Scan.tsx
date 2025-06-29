
import React, { useEffect } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { ArrowLeft, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Scan = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Simulate camera access
  useEffect(() => {
    console.log("Camera would be accessed here in a real app");
  }, []);

  return (
    <WalletLayout>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">{t("scan.title")}</h1>
      </div>
      
      <div className="glass-card mt-6 p-0 overflow-hidden h-[450px] relative">
        {/* This would be a camera view in a real app */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center space-y-3">
            <Camera size={48} className="mx-auto text-gray-300" />
            <p className="text-gray-300">
              {t("scan.position")}
            </p>
          </div>
        </div>
        
        {/* QR code frame */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/50 rounded-lg">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-crystal-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-crystal-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-crystal-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-crystal-primary rounded-br-lg" />
        </div>
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 bg-black/20 backdrop-blur-md"
        >
          <X size={20} />
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>{t("scan.info")}</p>
      </div>
    </WalletLayout>
  );
};

export default Scan;
