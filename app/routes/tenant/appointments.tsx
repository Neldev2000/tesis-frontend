import { AppointmentsPage } from "~/modules/appointments/components";

export function meta() {
  return [
    { title: "Citas - Hospital Management" },
    { name: "description", content: "Gestión de citas y agendas médicas" },
  ];
}

export default function Appointments() {
  return <AppointmentsPage />;
}
