
import React from "react";
import { useLanguage } from "@/contexts/language";
import { TradeStatus as TradeStatusType } from "../../context/types";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface TradeStatusProps {
  status: TradeStatusType;
}

const TradeStatus: React.FC<TradeStatusProps> = ({ status }) => {
  const { t } = useLanguage();

  const renderStatusBadge = (status: TradeStatusType) => {
    switch (status) {
      case "pending":
        return <div className="flex items-center text-yellow-400"><Clock className="mr-1 h-4 w-4" /> {t("p2p.status_pending", "Pending")}</div>;
      case "paid":
        return <div className="flex items-center text-blue-400"><Clock className="mr-1 h-4 w-4" /> {t("p2p.status_paid", "Payment Sent")}</div>;
      case "completed":
        return <div className="flex items-center text-green-400"><CheckCircle2 className="mr-1 h-4 w-4" /> {t("p2p.status_completed", "Completed")}</div>;
      case "disputed":
        return <div className="flex items-center text-red-400"><AlertTriangle className="mr-1 h-4 w-4" /> {t("p2p.status_disputed", "Disputed")}</div>;
      case "cancelled":
        return <div className="flex items-center text-gray-400"><Clock className="mr-1 h-4 w-4" /> {t("p2p.status_cancelled", "Cancelled")}</div>;
    }
  };

  return renderStatusBadge(status);
};

export default TradeStatus;
