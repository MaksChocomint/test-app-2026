import { useState, useCallback } from "react";

export const usePetSelection = (initialPetId: string | null = null) => {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    initialPetId,
  );

  const selectPet = useCallback((petId: string | null) => {
    setSelectedPetId(petId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPetId(null);
  }, []);

  return {
    selectedPetId,
    setSelectedPetId,
    selectPet,
    clearSelection,
  };
};
