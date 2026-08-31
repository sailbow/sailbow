import { useState } from "react";

export type Disclosure = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};
export const useDisclosure = () => {
  const [open, setIsOpen] = useState(false);

  function setOpened() {
    setIsOpen(true);
  }
  function setClosed() {
    setIsOpen(false);
  }

  return {
    open,
    setOpened,
    onOpenChange: setIsOpen,
    setClosed,
  };
};
