import { NewAppointmentPage } from "~/modules/appointments/components";

export function meta() {
  return [
    { title: "Nueva Cita - Hospital Management" },
    { name: "description", content: "Agendar nueva cita médica" },
  ];
}

export default function NewAppointment() {
  return <NewAppointmentPage />;
}
