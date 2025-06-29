
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/language";
import { Trade } from "../../context/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface TradeChatProps {
  trade: Trade;
  onSendMessage: (tradeId: string, message: string) => void;
}

const TradeChat: React.FC<TradeChatProps> = ({ trade, onSendMessage }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const { id, messages, status } = trade;
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Focus the input field as soon as the component renders
  useEffect(() => {
    if ((status === "pending" || status === "paid") && messageInputRef.current) {
      // Immediate focus without delay
      messageInputRef.current.focus();
    }
  }, [status, id]);
  
  // Handle sending messages
  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(id, message.trim());
    setMessage("");
    
    // Focus the input again after sending
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 10);
  };

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    return isToday 
      ? format(date, 'HH:mm') // Just time for today's messages
      : format(date, 'MMM dd, HH:mm'); // Date and time for older messages
  };

  return (
    <div className={`glass-card ${isMobile ? 'p-3' : 'p-4'} flex-grow flex flex-col overflow-hidden h-full`}>
      <h3 className={`font-medium ${isMobile ? 'mb-2 text-sm' : 'mb-3'} flex items-center`}>
        <MessageSquare className="mr-2 h-4 w-4" />
        {t("p2p.chat", "Chat")}
      </h3>
      
      <ScrollArea className={`flex-grow ${isMobile ? 'pr-1 mb-2' : 'pr-2 mb-4'}`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {t("p2p.start_chatting", "Start chatting with your trade partner")}
          </div>
        ) : (
          <div className={`space-y-2 ${isMobile ? 'p-1' : 'p-2'}`}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`
                  ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'} 
                  ${isMobile ? 'p-2' : 'p-3'} 
                  rounded-lg break-words
                  ${msg.isSystem 
                    ? "bg-white/5 text-gray-300 mx-auto max-w-[90%] text-center text-sm" 
                    : msg.senderId === "user-123" 
                      ? "bg-crystal-primary/20 ml-auto" 
                      : "bg-white/10 mr-auto"
                  }
                `}
              >
                {/* Message content */}
                <p className={isMobile ? 'text-sm' : ''}>{msg.content}</p>
                
                {/* Timestamp with icon */}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <p className="text-[10px] text-gray-400">
                    {formatMessageTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Message input with improved UI */}
      {(status === "pending" || status === "paid") && (
        <div className="flex gap-2 items-center mt-2 relative">
          <Input
            ref={messageInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("p2p.type_message", "Type a message...")}
            className={`flex-grow bg-white/5 border-white/10 ${isMobile ? 'text-sm h-9 pr-9' : 'pr-10'}`}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            autoFocus
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size={isMobile ? "sm" : "icon"}
            variant="ghost"
            className={`bg-crystal-primary/20 hover:bg-crystal-primary/30 absolute ${isMobile ? 'right-0.5 p-1' : 'right-1'}`}
          >
            <Send className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </Button>
        </div>
      )}
      
      {/* For completed trades, show message that chat is read-only */}
      {(status === "completed" || status === "cancelled" || status === "disputed") && (
        <div className={`text-center text-xs text-gray-400 py-2 bg-white/5 rounded-md ${isMobile ? 'text-[10px]' : ''}`}>
          {t("p2p.chat_read_only", "This chat is now read-only as the trade has been completed or cancelled.")}
        </div>
      )}
    </div>
  );
};

export default TradeChat;
