"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Pet } from "@/types/medicalRecord";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";
import { getSpeciesName } from "@/lib/speciesTranslator";

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | null;
  onPetChange: (petId: string | null) => void;
  onToggleForm: () => void;
  showForm: boolean;
  loading?: boolean;
}

export const PetSelector = React.memo(
  ({
    pets,
    selectedPetId,
    onPetChange,
    onToggleForm,
    showForm,
    loading = false,
  }: PetSelectorProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Фильтрация питомцев по поисковому запросу
    const filteredPets = useMemo(() => {
      return pets.filter((pet) => {
        const query = searchQuery.toLowerCase();
        if (!query) return true;

        return (
          pet.name.toLowerCase().includes(query) ||
          pet.owner.name.toLowerCase().includes(query) ||
          getSpeciesName(pet.species).toLowerCase().includes(query)
        );
      });
    }, [pets, searchQuery]);

    const handleSelectChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPetChange(e.target.value || null);
        // Очищаем поиск при выборе питомца
        setSearchQuery("");
      },
      [onPetChange],
    );

    const handleSearchClear = useCallback(() => {
      setSearchQuery("");
    }, []);

    return (
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-brand-dark">
          Медицинская карточка питомца
        </h1>
        <p className="text-gray-600 mt-1">
          Выберите питомца, чтобы просмотреть и добавить записи.
        </p>

        <div className="mt-4 space-y-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск питомца по имени, владельцу или виду..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mint focus:border-transparent"
              disabled={loading}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Выбор питомца и кнопка с открытием формы*/}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <select
              value={selectedPetId ?? ""}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-mint focus:border-transparent"
              disabled={loading}
            >
              <option value="">Выберите питомца</option>
              {filteredPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} • {getSpeciesName(pet.species)} • {pet.owner?.name}
                </option>
              ))}
            </select>

            <Button
              onClick={onToggleForm}
              className="sm:whitespace-nowrap"
              disabled={(!selectedPetId && !showForm) || loading}
            >
              {showForm ? "Закрыть" : "Добавить запись"}
            </Button>
          </div>

          {/* Подсказки */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Найдено:</span>{" "}
              {filteredPets.length} из {pets.length}
            </div>
            {selectedPetId && (
              <div>
                <span className="font-medium">Выбран:</span>{" "}
                {pets.find((p) => p.id === selectedPetId)?.name}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="mt-2 text-sm text-gray-500">Загрузка данных...</div>
        )}
      </div>
    );
  },
);

PetSelector.displayName = "PetSelector";
