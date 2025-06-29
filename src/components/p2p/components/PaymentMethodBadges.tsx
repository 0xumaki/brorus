
import React from "react";
import { PaymentMethod } from "../data/offerTypes";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodBadgesProps {
  methods: PaymentMethod[];
}

const PaymentMethodBadges: React.FC<PaymentMethodBadgesProps> = ({ methods }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {methods.map(method => (
        <Badge 
          key={method.id} 
          variant="outline"
          className="px-3 py-1.5 bg-white/5 text-xs font-medium border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <span className="text-crystal-primary">{method.icon}</span>
          <span>{method.name}</span>
        </Badge>
      ))}
    </div>
  );
};

export default PaymentMethodBadges;
