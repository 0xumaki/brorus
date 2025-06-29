
import React from "react";
import { useLanguage } from "@/contexts/language";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
  DrawerClose
} from "@/components/ui/drawer";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription, 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOfferForm from "./CreateOfferForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateOfferDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const CreateOfferDialog: React.FC<CreateOfferDialogProps> = ({ 
  trigger, 
  onSuccess = () => {} 
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  const triggerButton = trigger || (
    <Button size={isMobile ? "sm" : "default"} className="flex items-center gap-1">
      <Plus className="h-4 w-4" />
      {isMobile ? t("p2p.create", "Create") : t("p2p.create_new_listing", "Create New Listing")}
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} dismissible>
        <DrawerTrigger asChild>
          {triggerButton}
        </DrawerTrigger>
        <DrawerContent className="h-[90vh] rounded-t-xl overflow-hidden pb-8 px-4">
          <DrawerHeader className="pb-2 pt-5">
            <DrawerTitle className="text-xl">{t("p2p.create_new_listing", "Create New Listing")}</DrawerTitle>
            <DrawerDescription className="text-sm opacity-70">
              {t("p2p.create_offer_description", "Fill in the details to create a new P2P trading offer.")}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="mt-4 h-[calc(90vh-120px)] pr-4 px-1">
            <div className="pb-6">
              <CreateOfferForm onSuccess={handleSuccess} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("p2p.create_new_listing", "Create New Listing")}</DialogTitle>
          <DialogDescription>
            {t("p2p.create_offer_description", "Fill in the details to create a new P2P trading offer.")}
          </DialogDescription>
        </DialogHeader>
        <CreateOfferForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferDialog;
