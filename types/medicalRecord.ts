export interface Owner {
  id: string;
  name: string;
  phone?: string | null;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  owner: Owner;
}

export interface Vet {
  id: string;
  name: string;
  specialization?: string | null;
}

export interface Appointment {
  id: string;
  date: string;
  reason?: string | null;
}

export interface MedicalRecord {
  id: string;
  pet: Pet;
  vet: Vet;
  appointment?: Appointment | null;
  createdAt: string;
  complaints: string;
  examination: string;
  diagnosis: string;
  treatment?: string | null;
  recommendations?: string | null;
}
