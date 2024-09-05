import React, { useState, createContext, useContext } from 'react';

type Snack = {
    name: string;
    href: string;
}

interface SnackBarContextProps {
    snacks: Snack[];
    push: (snack: Snack) => void;
}
// Creating a context for SnackBar
const SnackBarContext = createContext<SnackBarContextProps | undefined>(undefined);

// SnackBar Provider Component
export const SnackBarProvider = ({ children }: { children: React.ReactNode}) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  // Method to add a new SnackBar
  const push = (snack: Snack) => {
    setSnacks(prevSnackBars => [...prevSnackBars, snack]);
  };

  return (
    <SnackBarContext.Provider value={{ snacks, push }}>
      {children}
    </SnackBarContext.Provider>
  );
};

// Custom hook to use SnackBar
export const useSnackBar = () => useContext(SnackBarContext);