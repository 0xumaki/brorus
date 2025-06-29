import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Transfer from "./pages/Transfer";
import TransactionHistory from "./pages/TransactionHistory";
import Market from "./pages/Market";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Receive from "./pages/Receive";
import Scan from "./pages/Scan";
import Swap from "./pages/Swap";
import P2P from "./pages/P2P";
import Tax from "./pages/Tax";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/language";
import { WalletProvider } from "./contexts/WalletContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <WalletProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                <Route path="/market" element={<Market />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/receive" element={<Receive />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/p2p" element={<P2P />} />
                <Route path="/tax" element={<Tax />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </NotificationProvider>
        </WalletProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
