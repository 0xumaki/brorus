import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, Send, LineChart, Settings, Users } from "lucide-react";
import { useLanguage } from "@/contexts/language";

interface WalletLayoutProps {
  children: React.ReactNode;
}

const WalletLayout: React.FC<WalletLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: Wallet, label: t("nav.wallet"), path: "/" },
    { icon: Send, label: t("nav.transfer"), path: "/transfer" },
    { icon: Users, label: t("nav.p2p_trading", "P2P Trading"), path: "/p2p" },
    { icon: LineChart, label: t("nav.market"), path: "/market" },
    { icon: Settings, label: t("nav.settings"), path: "/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-wallet-light/20 dark:bg-wallet-black/80">
      {/* Logo at the top */}
      <header className="w-full flex justify-center items-center py-6">
        <img
          src="/logo.png"
          alt="Crystal Wallet Logo"
          className="h-12 w-12 md:h-16 md:w-16 rounded-full shadow-lg border border-wallet-emerald/30 bg-white/80 object-contain"
          style={{ marginBottom: 8 }}
        />
      </header>
      <main style={{ width: "97%" }} className="flex-1 mx-auto max-w-5xl py-6 pb-32">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-dark shadow-lg border-t border-wallet-emerald/20">
        <div className="container max-w-5xl mx-auto px-2">
          <nav className="flex justify-around py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center px-2 py-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-wallet-emerald relative"
                      : "text-wallet-gray-400 hover:text-wallet-emerald"
                  }`}
                >
                  <div className={`p-2 ${isActive ? 'bg-wallet-emerald/20 rounded-full' : ''}`}>
                    <item.icon size={18} />
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-4 h-1 w-8 bg-wallet-emerald rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;
