
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-gradient">{t("notfound.title")}</h1>
        <p className="text-xl text-gray-300 mb-6">{t("notfound.message")}</p>
        <p className="text-gray-400 mb-8">
          {t("notfound.description")}
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-crystal-primary hover:bg-crystal-primary/80"
        >
          <ArrowLeft size={16} className="mr-2" /> {t("notfound.back")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
