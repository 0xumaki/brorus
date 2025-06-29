
import React from "react";
import { Send, PlusCircle, QrCode, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const WalletActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const actions = [
    {
      icon: Send,
      label: t("action.send"),
      color: "from-pink-500/20 to-purple-500/20",
      onClick: () => navigate("/transfer"),
    },
    {
      icon: PlusCircle,
      label: t("action.receive"),
      color: "from-blue-500/20 to-cyan-500/20",
      onClick: () => navigate("/receive"),
    },
    {
      icon: QrCode,
      label: t("action.scan"),
      color: "from-indigo-500/20 to-purple-500/20",
      onClick: () => navigate("/scan"),
    },
    {
      icon: ArrowUpDown,
      label: t("action.swap"),
      color: "from-purple-500/20 to-indigo-500/20",
      onClick: () => navigate("/swap"),
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex flex-col items-center wallet-action-btn"
        >
          <div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-br ${action.color} action-icon-gradient`}
          >
            <action.icon size={20} className="text-white" />
          </div>
          <span className="text-xs text-gray-300">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default WalletActions;
