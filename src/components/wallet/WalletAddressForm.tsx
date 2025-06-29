import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useLanguage } from "@/contexts/language";
import { Button } from "@/components/ui/button";

interface WalletAddressFormProps {
  onAddAddress: (address: { address: string; label: string }) => void;
  onClose: () => void;
}

const WalletAddressForm: React.FC<WalletAddressFormProps> = ({ onAddAddress, onClose }) => {
  const { t } = useLanguage();
  const { account, connectWallet, error, isConnected } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
    if (account) {
      onAddAddress({ address: account, label: t("wallet.metamask", "MetaMask Wallet") });
      onClose();
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4">
      <p className="text-center text-white/80 mb-2">
        {t("wallet.connect_prompt", "Connect your MetaMask wallet to continue.")}
      </p>
      <Button onClick={handleConnect} className="w-full" disabled={isConnected}>
        {isConnected ? t("wallet.connected", "Connected") : t("wallet.connect", "Connect MetaMask")}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {isConnected && account && (
        <div className="text-green-500 text-xs mt-2 break-all">{account}</div>
      )}
    </div>
  );
};

export default WalletAddressForm;
