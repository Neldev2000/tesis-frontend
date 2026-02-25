import { useState, useEffect } from "react";
import type { Doctor } from "../types";
import { mockSpecialties } from "./useSpecialties";

export const mockDoctors: Doctor[] = [
  {
    id: "doc-1",
    full_name: "Dra. María González",
    doctor_code: "MG-001",
    specialty_id: "sp-1",
    specialty: mockSpecialties[0],
    doctor_type: "specialist",
    max_daily_appointments: null,
    status: "active",
    initials: "MG",
  },
  {
    id: "doc-2",
    full_name: "Dr. Carlos Rodríguez",
    doctor_code: "CR-002",
    specialty_id: "sp-2",
    specialty: mockSpecialties[1],
    doctor_type: "general",
    max_daily_appointments: 2,
    status: "active",
    initials: "CR",
  },
  {
    id: "doc-3",
    full_name: "Dra. Ana Martínez",
    doctor_code: "AM-003",
    specialty_id: "sp-3",
    specialty: mockSpecialties[2],
    doctor_type: "specialist",
    max_daily_appointments: null,
    status: "active",
    initials: "AM",
  },
  {
    id: "doc-4",
    full_name: "Dr. Luis Hernández",
    doctor_code: "LH-004",
    specialty_id: "sp-4",
    specialty: mockSpecialties[3],
    doctor_type: "specialist",
    max_daily_appointments: null,
    status: "active",
    initials: "LH",
  },
  {
    id: "doc-5",
    full_name: "Dra. Patricia López",
    doctor_code: "PL-005",
    specialty_id: "sp-5",
    specialty: mockSpecialties[4],
    doctor_type: "specialist",
    max_daily_appointments: null,
    status: "active",
    initials: "PL",
  },
  {
    id: "doc-6",
    full_name: "Dr. Roberto Díaz",
    doctor_code: "RD-006",
    specialty_id: "sp-2",
    specialty: mockSpecialties[1],
    doctor_type: "general",
    max_daily_appointments: 2,
    status: "active",
    initials: "RD",
  },
];

export function useDoctors(specialtyId?: string) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const data = specialtyId
    ? mockDoctors.filter((d) => d.specialty_id === specialtyId)
    : mockDoctors;

  return { data, isLoading };
}
