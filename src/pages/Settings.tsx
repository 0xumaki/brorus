
import React from "react";
import WalletLayout from "@/components/layout/WalletLayout";
import { 
  Shield, 
  Key, 
  Languages, 
  HelpCircle, 
  ChevronRight,
  Bell,
  UserCircle
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

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
    toast.success(`${value === 'english' ? 'English' : 'Burmese'} language selected`);
  };

  const getLanguageDisplayName = () => {
    return t(`language.${language}`);
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
      title: t("settings.support"),
      items: [
        { icon: HelpCircle, label: t("settings.help"), chevron: true },
      ]
    }
  ];

  return (
    <WalletLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">{t("settings.title")}</h1>
        <p className="text-gray-400 text-sm">{t("settings.manage")}</p>
      </div>

      <div className="space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="glass-card">
            <h3 className="font-medium p-4">{group.title}</h3>
            <Separator className="bg-white/10" />
            
            <div className="divide-y divide-white/10">
              {group.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full glass flex items-center justify-center mr-3">
                      <item.icon size={16} className="text-crystal-primary" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {item.value && !item.select && (
                      <span className="text-sm text-gray-400 mr-2">{item.value}</span>
                    )}
                    
                    {item.select && (
                      <Select
                        value={language}
                        onValueChange={item.onSelect}
                      >
                        <SelectTrigger className="w-32 border-white/10 bg-white/5">
                          <SelectValue placeholder={getLanguageDisplayName()} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">{t("language.english")}</SelectItem>
                          <SelectItem value="burmese">{t("language.burmese")}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {item.toggle && (
                      <Switch 
                        checked={item.toggled} 
                        className="data-[state=checked]:bg-crystal-primary" 
                      />
                    )}
                    
                    {item.chevron && <ChevronRight size={18} className="text-gray-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-gray-400">{t("settings.version")}</p>
        </div>
      </div>
    </WalletLayout>
  );
};

export default Settings;
