
import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { UserFeedback } from "../../context/TradeContext";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: UserFeedback) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  const handleSubmit = () => {
    const feedback: UserFeedback = {
      rating,
      comment: feedbackComment.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    
    onSubmit(feedback);
    setRating(5);
    setFeedbackComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle>{t("p2p.leave_feedback", "Leave Feedback")}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t("p2p.feedback_description", "Rate your experience with this trader")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star 
                className={`h-8 w-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
              />
            </button>
          ))}
        </div>
        
        <Textarea
          value={feedbackComment}
          onChange={(e) => setFeedbackComment(e.target.value)}
          placeholder={t("p2p.feedback_comment", "Additional comments (optional)")}
          className="bg-white/5 border-white/10"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating < 1}
          >
            {t("p2p.submit_feedback", "Submit Feedback")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
