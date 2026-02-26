import { useState } from "react";
import { MultiStepDialog, type Step } from "~/shared/components";
import { PatientSearchStep } from "./PatientSearchStep";
import { SpecialtyDoctorStep } from "./SpecialtyDoctorStep";
import { SlotPickerStep } from "./SlotPickerStep";
import { ConfirmAppointmentStep } from "./ConfirmAppointmentStep";
import type { Patient, Doctor, Specialty, AppointmentType } from "../types";

interface NewAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const steps: Step[] = [
  { id: "patient", title: "Paciente", description: "Seleccionar paciente" },
  {
    id: "specialty",
    title: "Especialidad",
    description: "Doctor y especialidad",
  },
  { id: "slot", title: "Fecha y Hora", description: "Horario disponible" },
  { id: "confirm", title: "Confirmar", description: "Revisar y crear" },
];

export function NewAppointmentDialog({
  open,
  onClose,
  onComplete,
}: NewAppointmentDialogProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(
    null
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  // Mock: auto-detect appointment type (first_visit if no prior visits)
  const isFirstVisit = true; // In real app, check consultation history
  const appointmentType: AppointmentType = isFirstVisit
    ? "first_visit"
    : "follow_up";

  const durationMinutes = selectedSpecialty
    ? isFirstVisit
      ? selectedSpecialty.default_first_visit_duration
      : selectedSpecialty.default_follow_up_duration
    : 30;

  function handleClose() {
    // Reset state on close
    setSelectedPatient(null);
    setSelectedSpecialtyId(null);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setReason("");
    onClose();
  }

  function handleComplete() {
    // Mock: just close (in real app, would call mutation)
    handleClose();
    onComplete?.();
  }

  return (
    <MultiStepDialog
      open={open}
      onClose={handleClose}
      steps={steps}
      stepperVariant="compact"
      size="xl"
      className="sm:max-w-2xl"
      onComplete={handleComplete}
    >
      {/* Step 1: Patient Search */}
      <MultiStepDialog.Panel step={0}>
        <MultiStepDialog.Header>
          <MultiStepDialog.Title>Seleccionar Paciente</MultiStepDialog.Title>
          <MultiStepDialog.Description>
            Busque y seleccione el paciente para la cita.
          </MultiStepDialog.Description>
        </MultiStepDialog.Header>
        <MultiStepDialog.Body>
          <PatientSearchStep
            selectedPatient={selectedPatient}
            onSelect={setSelectedPatient}
          />
        </MultiStepDialog.Body>
        <MultiStepDialog.Footer nextLabel="Continuar" />
      </MultiStepDialog.Panel>

      {/* Step 2: Specialty & Doctor */}
      <MultiStepDialog.Panel step={1}>
        <MultiStepDialog.Header>
          <MultiStepDialog.Title>
            Especialidad y Doctor
          </MultiStepDialog.Title>
          <MultiStepDialog.Description>
            Seleccione la especialidad y el doctor para la cita.
          </MultiStepDialog.Description>
        </MultiStepDialog.Header>
        <MultiStepDialog.Body>
          <SpecialtyDoctorStep
            selectedSpecialtyId={selectedSpecialtyId}
            selectedDoctor={selectedDoctor}
            onSelectSpecialty={(id, spec) => {
              setSelectedSpecialtyId(id);
              setSelectedSpecialty(spec);
              setSelectedDoctor(null); // Reset doctor when specialty changes
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            onSelectDoctor={(doc) => {
              setSelectedDoctor(doc);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            isFirstVisit={isFirstVisit}
          />
        </MultiStepDialog.Body>
        <MultiStepDialog.Footer nextLabel="Continuar" />
      </MultiStepDialog.Panel>

      {/* Step 3: Slot Picker */}
      <MultiStepDialog.Panel step={2}>
        <MultiStepDialog.Header>
          <MultiStepDialog.Title>Fecha y Hora</MultiStepDialog.Title>
          <MultiStepDialog.Description>
            Seleccione un horario disponible para{" "}
            {selectedDoctor?.full_name ?? "el doctor"}.
          </MultiStepDialog.Description>
        </MultiStepDialog.Header>
        <MultiStepDialog.Body>
          <SlotPickerStep
            doctorId={selectedDoctor?.id ?? null}
            durationMinutes={durationMinutes}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setSelectedTime(null);
            }}
            onSelectTime={setSelectedTime}
          />
        </MultiStepDialog.Body>
        <MultiStepDialog.Footer nextLabel="Continuar" />
      </MultiStepDialog.Panel>

      {/* Step 4: Confirm */}
      <MultiStepDialog.Panel step={3}>
        <MultiStepDialog.Header>
          <MultiStepDialog.Title>Confirmar Cita</MultiStepDialog.Title>
          <MultiStepDialog.Description>
            Revise los detalles y confirme la creación de la cita.
          </MultiStepDialog.Description>
        </MultiStepDialog.Header>
        <MultiStepDialog.Body>
          <ConfirmAppointmentStep
            patient={selectedPatient}
            doctor={selectedDoctor}
            specialty={selectedSpecialty}
            date={selectedDate}
            time={selectedTime}
            appointmentType={appointmentType}
            durationMinutes={durationMinutes}
            reason={reason}
            onReasonChange={setReason}
          />
        </MultiStepDialog.Body>
        <MultiStepDialog.Footer completeLabel="Crear Cita" />
      </MultiStepDialog.Panel>
    </MultiStepDialog>
  );
}
