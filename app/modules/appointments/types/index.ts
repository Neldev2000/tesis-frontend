// Appointment status state machine:
// requested → confirmed → in_progress → completed
//          ↘ cancelled
//          ↘ rescheduled → confirmed
// in_progress → no_show
export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show";

export type AppointmentType = "first_visit" | "follow_up";

export type DoctorType = "general" | "specialist";

export type PatientRole = "worker" | "professor" | "student" | "family_member";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AppointmentTab = "list" | "agenda" | "schedule";

export interface Specialty {
  id: string;
  name: string;
  default_first_visit_duration: number; // minutes
  default_follow_up_duration: number; // minutes
}

export interface Doctor {
  id: string;
  full_name: string;
  doctor_code: string;
  specialty_id: string;
  specialty?: Specialty;
  doctor_type: DoctorType;
  max_daily_appointments: number | null;
  status: "active" | "inactive";
  initials: string;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: DayOfWeek;
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  is_active: boolean;
}

export interface DoctorBlock {
  id: string;
  doctor_id: string;
  start_date: string; // ISO date "YYYY-MM-DD"
  end_date: string;
  reason: string;
}

export interface Patient {
  id: string;
  first_name: string;
  second_name?: string;
  first_lastname: string;
  second_lastname?: string;
  ci: string;
  email: string;
  cellphone: string;
  role: PatientRole;
  status: "active" | "inactive";
  nhm: string; // formato "00.00.00"
  initials: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient?: Patient;
  doctor_id: string;
  doctor?: Doctor;
  specialty_id: string;
  specialty?: Specialty;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  scheduled_date: string; // ISO date "YYYY-MM-DD"
  scheduled_start_time: string; // "HH:mm"
  scheduled_end_time: string; // "HH:mm"
  reason?: string;
  cancellation_reason?: string;
  rescheduled_from_id?: string;
  created_at: string;
}

export interface AppointmentFilters {
  status: AppointmentStatus | "all";
  doctor_id: string | "all";
  specialty_id: string | "all";
  date_from: string;
  date_to: string;
  search: string;
}

export interface TimeSlot {
  time: string; // "HH:mm"
  available: boolean;
}

export interface AvailableSlotsResult {
  slots: TimeSlot[];
  blocked: boolean;
  block_reason?: string;
}
