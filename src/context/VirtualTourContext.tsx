import React, { createContext, useContext, useState } from 'react';

interface VirtualTourContextType {
  activeTourId: number | null;
  setActiveTourId: (id: number | null) => void;
  isVirtualTourActive: boolean;
  setIsVirtualTourActive: (active: boolean) => void;
}

const VirtualTourContext = createContext<VirtualTourContextType | undefined>(undefined);

export function VirtualTourProvider({ children }: { children: React.ReactNode }) {
  const [activeTourId, setActiveTourId] = useState<number | null>(null);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);

  return (
    <VirtualTourContext.Provider
      value={{
        activeTourId,
        setActiveTourId,
        isVirtualTourActive,
        setIsVirtualTourActive,
      }}
    >
      {children}
    </VirtualTourContext.Provider>
  );
}

export function useVirtualTour() {
  const context = useContext(VirtualTourContext);
  if (context === undefined) {
    throw new Error('useVirtualTour must be used within a VirtualTourProvider');
  }
  return context;
}