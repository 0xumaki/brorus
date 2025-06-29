import React, { useState } from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { 
  Shield, 
  Key, 
  Languages, 
  HelpCircle, 
  ChevronRight,
  Bell,
  UserCircle,
  AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import AlertSettings from "@/components/settings/AlertSettings";

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
    toast.success(`${value === 'english' ? 'English' : 'Burmese'} language selected`);
  };

  const getLanguageDisplayName = () => {
    return t(`language.${language}`);
  };

  const handleSectionClick = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const settingsGroups = [
    {
      title: t("settings.account"),
      items: [
        { icon: UserCircle, label: t("settings.profile"), chevron: true },
        { icon: Key, label: t("settings.security"), chevron: true },
        { icon: Shield, label: t("settings.privacy"), chevron: true },
      ]
    },
    {
      title: t("settings.preferences"),
      items: [
        { icon: Bell, label: t("settings.notifications"), toggle: true, toggled: true },
        { 
          icon: Languages, 
          label: t("settings.language"), 
          select: true, 
          value: getLanguageDisplayName(),
          onSelect: handleLanguageChange
        },
      ]
    },
    {
      title: "Alerts & Monitoring",
      items: [
        { 
          icon: AlertTriangle, 
          label: "Price & Gas Alerts", 
          chevron: true,
          section: "alerts"
        },
      ]
    },
    {
      title: t("settings.support"),
      items: [
        { icon: HelpCircle, label: t("settings.help"), chevron: true },
      ]
    }
  ];

  return (
    <WalletLayout>
      <div className="relative min-h-screen w-full pb-12">
        {/* Subtle background gradient/pattern */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-crystal-primary/10 via-blue-900/10 to-black/60 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(80,200,255,0.08) 0, transparent 60%)'}} />
        <div className="relative z-0 max-w-2xl mx-auto px-2 sm:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-crystal-primary drop-shadow-lg mb-2">{t("settings.title")}</h1>
            <p className="text-gray-300 text-base font-medium">{t("settings.manage")}</p>
          </div>
          <div className="space-y-10">
            {settingsGroups.map((group, groupIndex) => {
              const GroupIcon = group.items[0].icon;
              return (
                <div key={groupIndex} className="glass-card relative overflow-hidden border border-crystal-primary/20 shadow-xl backdrop-blur-lg bg-white/10 bg-gradient-to-br from-white/10 to-crystal-primary/5 p-0">
                  {/* Accent bar or icon */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-crystal-primary/80 to-blue-400/60 rounded-tr-lg rounded-br-lg" />
                  <div className="flex items-center gap-3 px-6 pt-5 pb-2">
                    <div className="w-8 h-8 rounded-full bg-crystal-primary/20 flex items-center justify-center shadow-md">
                      <GroupIcon size={22} className="text-crystal-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-crystal-primary drop-shadow-sm tracking-wide">{group.title}</h3>
                  </div>
                  <Separator className="bg-crystal-primary/10" />
                  <div className="divide-y divide-white/10">
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <div 
                          className="flex items-center justify-between px-6 py-4 hover:bg-crystal-primary/10 focus-within:bg-crystal-primary/10 transition-colors cursor-pointer group"
                          onClick={() => item.section ? handleSectionClick(item.section) : undefined}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mr-4 shadow-md group-hover:scale-105 transition-transform">
                              <item.icon size={22} className="text-crystal-primary" />
                            </div>
                            <span className="font-medium text-base text-white drop-shadow-sm">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.value && !item.select && (
                              <span className="text-base text-gray-300 mr-2 font-semibold">{item.value}</span>
                            )}
                            {item.select && (
                              <Select
                                value={language}
                                onValueChange={item.onSelect}
                              >
                                <SelectTrigger className="w-40 h-12 border-crystal-primary/30 bg-white/10 text-lg font-semibold text-crystal-primary shadow-md focus:ring-2 focus:ring-crystal-primary/40 focus:border-crystal-primary/60 transition-all">
                                  <SelectValue placeholder={getLanguageDisplayName()} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-crystal-primary/30 bg-white/90 text-crystal-primary shadow-xl">
                                  <SelectItem value="english" className="text-base">{t("language.english")}</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                            {item.toggle && (
                              <Switch 
                                checked={item.toggled} 
                                className="data-[state=checked]:bg-crystal-primary scale-125 shadow-md" 
                              />
                            )}
                            {item.chevron && (
                              <ChevronRight 
                                size={28} 
                                className={`text-crystal-primary/70 group-hover:text-crystal-primary transition-transform duration-200 ${
                                  activeSection === item.section ? 'rotate-90' : ''
                                }`} 
                              />
                            )}
                          </div>
                        </div>
                        {/* Alert Settings Section */}
                        {item.section === "alerts" && activeSection === "alerts" && (
                          <div className="px-6 pb-6">
                            <AlertSettings />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="glass-card p-6 text-center border border-crystal-primary/10 shadow-lg bg-white/10">
              <p className="text-base text-gray-300 font-semibold">{t("settings.version")}</p>
            </div>
          </div>
        </div>
      </div>
    </WalletLayout>
  );
};

export default Settings;
