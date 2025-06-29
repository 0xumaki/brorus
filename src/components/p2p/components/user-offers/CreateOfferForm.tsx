
import React, { useState } from "react";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTrade } from "../../context/TradeContext";
import { Checkbox } from "@/components/ui/checkbox";
import { paymentMethods, TradeType } from "../../data/offerTypes";
import { useIsMobile } from "@/hooks/use-mobile";

type CreateOfferProps = {
  onSuccess: () => void;
};

const CreateOfferForm: React.FC<CreateOfferProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { createOffer } = useTrade();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "sell" as TradeType,
    price: "",
    currency: "MMK",
    cryptoCurrency: "USDT",
    available: "",
    min: "",
    max: "",
    selectedPaymentMethods: [] as number[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const togglePaymentMethod = (id: number) => {
    const currentMethods = [...formData.selectedPaymentMethods];
    const index = currentMethods.indexOf(id);

    if (index === -1) {
      currentMethods.push(id);
    } else {
      currentMethods.splice(index, 1);
    }

    setFormData({ ...formData, selectedPaymentMethods: currentMethods });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string values to numbers
      const numericData = {
        ...formData,
        price: parseFloat(formData.price),
        available: parseFloat(formData.available),
        min: parseFloat(formData.min),
        max: parseFloat(formData.max),
      };

      // Get the payment methods objects from the IDs
      const selectedPaymentMethodObjects = paymentMethods.filter(method => 
        formData.selectedPaymentMethods.includes(method.id)
      );

      await createOffer({
        ...numericData,
        paymentMethods: selectedPaymentMethodObjects,
      });

      onSuccess();
    } catch (error) {
      console.error("Error creating offer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-2">
      <div className="space-y-2">
        <Label>{t("p2p.offer_type", "Offer Type")}</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleSelectChange("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">{t("p2p.buy", "Buy")}</SelectItem>
            <SelectItem value="sell">{t("p2p.sell", "Sell")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">{t("p2p.price", "Price")}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>{t("p2p.currency", "Currency")}</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleSelectChange("currency", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MMK">MMK</SelectItem>
              <SelectItem value="THB">THB</SelectItem>
              <SelectItem value="SGD">SGD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("p2p.crypto_currency", "Crypto Currency")}</Label>
        <Select
          value={formData.cryptoCurrency}
          onValueChange={(value) => handleSelectChange("cryptoCurrency", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="BTC">BTC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="available">{t("p2p.available", "Available")}</Label>
          <Input
            id="available"
            name="available"
            type="number"
            min="0"
            step="0.01"
            value={formData.available}
            onChange={handleInputChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="min">{t("p2p.minimum", "Minimum")}</Label>
          <Input
            id="min"
            name="min"
            type="number"
            min="0"
            step="0.01"
            value={formData.min}
            onChange={handleInputChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max">{t("p2p.maximum", "Maximum")}</Label>
          <Input
            id="max"
            name="max"
            type="number"
            min="0"
            step="0.01"
            value={formData.max}
            onChange={handleInputChange}
            required
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("p2p.payment_methods", "Payment Methods")}</Label>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-3 max-h-[180px] overflow-y-auto p-1">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2 p-2 rounded hover:bg-white/5">
              <Checkbox
                id={`payment-${method.id}`}
                checked={formData.selectedPaymentMethods.includes(method.id)}
                onCheckedChange={() => togglePaymentMethod(method.id)}
              />
              <Label htmlFor={`payment-${method.id}`} className="cursor-pointer">
                {method.icon} {method.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? t("common.loading", "Loading...") : t("p2p.create_listing", "Create Listing")}
      </Button>
    </form>
  );
};

export default CreateOfferForm;
