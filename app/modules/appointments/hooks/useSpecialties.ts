import { useState, useEffect } from "react";
import type { Specialty } from "../types";

export const mockSpecialties: Specialty[] = [
  {
    id: "sp-1",
    name: "Cardiología",
    default_first_visit_duration: 60,
    default_follow_up_duration: 30,
  },
  {
    id: "sp-2",
    name: "Medicina General",
    default_first_visit_duration: 45,
    default_follow_up_duration: 20,
  },
  {
    id: "sp-3",
    name: "Dermatología",
    default_first_visit_duration: 45,
    default_follow_up_duration: 30,
  },
  {
    id: "sp-4",
    name: "Psicología",
    default_first_visit_duration: 60,
    default_follow_up_duration: 45,
  },
  {
    id: "sp-5",
    name: "Oftalmología",
    default_first_visit_duration: 40,
    default_follow_up_duration: 20,
  },
];

export function useSpecialties() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return { data: mockSpecialties, isLoading };
}
