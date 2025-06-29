
import React from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import P2PMarketplace from "@/components/p2p/P2PMarketplace";
import { useLanguage } from "@/contexts/language";
import { CreditCard, RefreshCw, Shield } from "lucide-react";

const P2P = () => {
  const { t } = useLanguage();
  
  return (
    <WalletLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("p2p.title", "P2P Trading")}</h1>
          <p className="text-gray-400 mt-1">{t("p2p.subtitle", "Buy and sell crypto directly with other users")}</p>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/10">
              <Shield className="h-5 w-5 text-crystal-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t("p2p.secure", "Secure Trading")}</h3>
              <p className="text-xs text-gray-400">{t("p2p.escrow", "Protected by escrow service")}</p>
            </div>
          </div>
          
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/10">
              <CreditCard className="h-5 w-5 text-crystal-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t("p2p.multiple_payments", "Multiple Payment Options")}</h3>
              <p className="text-xs text-gray-400">{t("p2p.payment_options", "Bank transfers, mobile payments & more")}</p>
            </div>
          </div>
          
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/10">
              <RefreshCw className="h-5 w-5 text-crystal-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t("p2p.fast", "Fast Settlements")}</h3>
              <p className="text-xs text-gray-400">{t("p2p.quick_trades", "Complete trades in minutes")}</p>
            </div>
          </div>
        </div>
        
        <P2PMarketplace />
      </div>
    </WalletLayout>
  );
};

export default P2P;
