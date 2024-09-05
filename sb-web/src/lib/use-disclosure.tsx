import { useState } from "react";

type Disclosure = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
};
export const useDisclosure = (): Disclosure => {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }

  return {
    isOpen,
    onOpenChange: setIsOpen,
    open,
    close,
  };
};
