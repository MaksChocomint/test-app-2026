export const speciesMap: Record<string, string> = {
  DOG: "Собака",
  CAT: "Кошка",
  BIRD: "Птица",
  RODENT: "Грызун",
  REPTILE: "Рептилия",
  FISH: "Рыба",
  OTHER: "Другое",
};

export const getSpeciesName = (species: string): string => {
  return speciesMap[species] || species;
};
