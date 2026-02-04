"use client";

import React from "react";
import {
  FileText,
  Calendar,
  PawPrint,
  Stethoscope,
  Trash2,
  Edit,
} from "lucide-react";
import { MedicalRecord } from "@/types/medicalRecord";
import { getSpeciesName } from "@/lib/speciesTranslator";

interface MedicalRecordRowProps {
  record: MedicalRecord;
  expanded: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (record: MedicalRecord) => void;
}

export const MedicalRecordRow = React.memo(
  ({ record, expanded, onToggle, onDelete, onEdit }: MedicalRecordRowProps) => {
    return (
      <div className="p-6 hover:bg-gray-50">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-orange/10">
                    <FileText className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Запись от{" "}
                      {new Date(record.createdAt).toLocaleDateString("ru-RU")}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <PawPrint className="h-4 w-4 mr-1" />
                        {record.pet.name} • {getSpeciesName(record.pet.species)}{" "}
                        • {record.pet.owner.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Stethoscope className="h-4 w-4 mr-1" />
                        {record.vet.name}
                      </div>
                      {record.appointment && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(record.appointment.date).toLocaleDateString(
                            "ru-RU",
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Диагноз
                    </h4>
                    <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                      {record.diagnosis}
                    </p>
                  </div>

                  {expanded && (
                    <div className="space-y-3 mt-4 pl-4 border-l-2 border-brand-mint">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Жалобы
                        </h4>
                        <p className="text-gray-600">{record.complaints}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Результаты осмотра
                        </h4>
                        <p className="text-gray-600">{record.examination}</p>
                      </div>
                      {record.treatment && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Лечение
                          </h4>
                          <p className="text-gray-600">{record.treatment}</p>
                        </div>
                      )}
                      {record.recommendations && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            Рекомендации
                          </h4>
                          <p className="text-gray-600">
                            {record.recommendations}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggle(record.id)}
                  className="text-sm text-brand-mint hover:text-brand-mint/80"
                >
                  {expanded ? "Свернуть" : "Подробнее"}
                </button>
                <button
                  onClick={() => onEdit(record)}
                  className="text-brand-blue hover:text-brand-blue/80 p-1"
                  title="Редактировать"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(record.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Удалить"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

MedicalRecordRow.displayName = "MedicalRecordRow";
