// Импортируем типы прямо из Prisma, чтобы не дублировать Enums
import {
  Species,
  Gender,
  AppointmentStatus,
} from "../app/generated/prisma/client";

// Интерфейс Владельца
export interface IOwner {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  pets?: IPet[];
  createdAt: Date;
}

// Интерфейс Питомца
export interface IPet {
  id: string;
  name: string;
  species: Species;
  breed?: string | null;
  birthDate?: Date | null;
  gender: Gender;
  ownerId: string;
  owner?: IOwner;
  medicalRecords?: IMedicalRecord[];
  appointments?: IAppointment[];
}

// Интерфейс Ветеринара
export interface IVet {
  id: string;
  name: string;
  specialization?: string | null;
  phone?: string | null;
}

// Интерфейс Записи на прием
export interface IAppointment {
  id: string;
  date: Date;
  status: AppointmentStatus;
  reason: string;
  petId: string;
  pet?: IPet;
  vetId: string;
  vet?: IVet;
  medicalRecord?: IMedicalRecord | null;
}

// Интерфейс Медицинской карты
export interface IMedicalRecord {
  id: string;
  complaints: string;
  examination: string;
  diagnosis: string;
  treatment?: string | null;
  recommendations?: string | null;
  petId: string;
  vetId: string;
  appointmentId?: string | null;
  createdAt: Date;
}
