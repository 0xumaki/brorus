
import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

interface DisputeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DisputeDialog: React.FC<DisputeDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [disputeReason, setDisputeReason] = useState("");

  const handleSubmit = () => {
    if (!disputeReason.trim()) return;
    onSubmit(disputeReason);
    setDisputeReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle>{t("p2p.open_dispute", "Open Dispute")}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t("p2p.dispute_description", "Please explain your issue. Our team will review your case.")}
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={disputeReason}
          onChange={(e) => setDisputeReason(e.target.value)}
          placeholder={t("p2p.dispute_reason", "Describe your issue in detail...")}
          className="bg-white/5 border-white/10 min-h-[120px]"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
            disabled={!disputeReason.trim()}
          >
            {t("p2p.submit_dispute", "Submit Dispute")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDialog;
