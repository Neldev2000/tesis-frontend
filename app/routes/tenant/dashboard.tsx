import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Button,
  Card,
  Avatar,
  AvatarGroup,
  StatusBadge,
  MultiStepDialog,
  Input,
  Textarea,
  Sparkline,
  TrendIndicator,
  StockIndicator,
  type Step,
} from "~/shared/components";

export function meta() {
  return [
    { title: "Dashboard - Hospital Management" },
    { name: "description", content: "Hospital management dashboard" },
  ];
}

// Mock data with sparkline data
const statsData = {
  patients: {
    value: 156,
    change: "+12%",
    direction: "up" as const,
    sparkline: [120, 135, 128, 142, 138, 150, 156],
  },
  appointments: {
    value: 8,
    remaining: 4,
    sparkline: [5, 7, 6, 8, 7, 9, 8],
  },
  alerts: {
    value: 3,
    label: "items low",
  },
};

const todaySchedule = [
  {
    id: 1,
    patient: "John Doe",
    type: "Routine Checkup",
    room: "Room 302",
    time: "09:00",
    status: "completed" as const,
  },
  {
    id: 2,
    patient: "Jane Smith",
    type: "General Consultation",
    room: "Room 105",
    time: "10:30",
    status: "confirmed" as const,
  },
  {
    id: 3,
    patient: "Robert Brown",
    type: "Post-Op Follow-up",
    room: "Room 204",
    time: "13:00",
    status: "pending" as const,
  },
  {
    id: 4,
    patient: "Emily Davis",
    type: "Blood Work & Lab",
    room: "Lab A",
    time: "14:30",
    status: "confirmed" as const,
  },
];

const lowStockItems = [
  { name: "Amoxicillin 500mg", current: 15, max: 100, reorder: 20 },
  { name: "Ibuprofen 400mg", current: 45, max: 100, reorder: 50 },
  { name: "Insulin Glargine", current: 8, max: 50, reorder: 10 },
];

const recentPatients = [
  { id: "PAT-8832", name: "Sarah Wilson", condition: "Hypertension", status: "admitted" as const },
  { id: "PAT-7741", name: "Michael Chen", condition: "Fracture", status: "observation" as const },
  { id: "PAT-6623", name: "Lisa Anderson", condition: "Diabetes Type 2", status: "discharged" as const },
  { id: "PAT-5512", name: "James Martinez", condition: "Pneumonia", status: "critical" as const },
];

const availableDoctors = [
  { name: "Dr. Emily White", specialty: "Pediatrics", ext: "402", status: "online" as const },
  { name: "Dr. James Lee", specialty: "Cardiology", ext: "210", status: "online" as const },
  { name: "Dr. Sarah Connor", specialty: "Neurology", ext: "Break", status: "away" as const },
];

const patientSteps: Step[] = [
  { id: "info", title: "Patient Info", description: "Basic details" },
  { id: "medical", title: "Medical History", description: "Health records" },
  { id: "insurance", title: "Insurance", description: "Coverage info" },
];

const appointmentSteps: Step[] = [
  { id: "patient", title: "Select Patient", description: "Choose patient" },
  { id: "schedule", title: "Schedule", description: "Date & time" },
  { id: "details", title: "Details", description: "Appointment info" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Compact Header - responsive for mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Secondary action - ghost/outline */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 sm:flex-initial"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            }
            onClick={() => setAddPatientOpen(true)}
          >
            Add Patient
          </Button>
          {/* Primary action - solid */}
          <Button
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-initial"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
            onClick={() => setNewAppointmentOpen(true)}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENTO GRID LAYOUT - True asymmetric grid with independent heights
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* HERO: Total Patients - wider card */}
        {/* Using primary viking color for main stat, emerald only for positive trend */}
        <Card variant="default" padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-viking-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-viking-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Total Patients</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-gray-900 tabular-nums tracking-tight">{statsData.patients.value}</span>
                <TrendIndicator value={statsData.patients.change} direction={statsData.patients.direction} />
              </div>
            </div>
            <Sparkline data={statsData.patients.sparkline} color="default" width={140} height={56} />
          </div>
        </Card>

        {/* Today's Appointments - compact */}
        {/* Using gray icon - color only for semantic meaning */}
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500">Today</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-gray-900 tabular-nums tracking-tight">{statsData.appointments.value}</span>
              <span className="text-sm text-gray-400 ml-1">appts</span>
              <p className="text-xs text-gray-400 mt-1">{statsData.appointments.remaining} remaining</p>
            </div>
            <Sparkline data={statsData.appointments.sparkline} color="default" width={64} height={32} />
          </div>
        </Card>

        {/* Inventory Alerts - compact */}
        {/* Amber only because it's a warning/alert - semantic color use */}
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500">Alerts</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-4xl font-bold text-gray-900 tabular-nums tracking-tight">{statsData.alerts.value}</span>
              <span className="text-sm text-gray-400 ml-1">low</span>
            </div>
            <Link
              to="inventory"
              className="text-xs font-medium text-viking-500 hover:text-viking-600 transition-colors"
            >
              View →
            </Link>
          </div>
        </Card>
      </div>

      {/* Row 2: Main Content - Asymmetric heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Today's Schedule - TALL card */}
        <Card className="lg:col-span-2" padding="none">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100/60">
            <h3 className="text-sm font-semibold text-gray-900">Today's Schedule</h3>
            <Link to="appointments" className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
              View all →
            </Link>
          </div>
          {/* Compact schedule - single line per appointment, no tennis match scanning */}
          <div className="divide-y divide-gray-100/60">
            {todaySchedule.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors group cursor-pointer"
              >
                {/* Time + status indicator grouped */}
                <div className="flex items-center gap-2 w-20 flex-shrink-0">
                  <StatusDot status={appointment.status} />
                  <span className="text-sm font-medium text-gray-900 tabular-nums">{appointment.time}</span>
                </div>
                {/* Patient + type + room - all inline */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">{appointment.patient}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-sm text-gray-500 truncate">{appointment.type}</span>
                  <span className="text-xs text-gray-400 bg-gray-100/60 px-1.5 py-0.5 rounded flex-shrink-0">{appointment.room}</span>
                </div>
                {/* Chevron on hover */}
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock - SHORT card */}
        <Card padding="none">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100/60">
            <h3 className="text-sm font-semibold text-gray-900">Low Stock</h3>
            <Link to="inventory" className="text-xs font-medium text-amber-500 hover:text-amber-600 transition-colors">
              Order →
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <span className="text-xs text-gray-500 tabular-nums">{item.current}/{item.max}</span>
                </div>
                <StockIndicator
                  current={item.current}
                  max={item.max}
                  reorderLevel={item.reorder}
                  size="md"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Bottom section - different layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        {/* Available Doctors - COMPACT with AvatarGroup header */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-gray-100/60">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Available Now</h3>
              <AvatarGroup size="xs">
                {availableDoctors.filter(d => d.status === 'online').map((doctor, index) => (
                  <Avatar
                    key={index}
                    alt={doctor.name}
                    size="xs"
                    initials={doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                    status="online"
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {availableDoctors.map((doctor, index) => (
              <div key={index} className="flex items-center gap-3 py-1">
                <Avatar
                  alt={doctor.name}
                  size="sm"
                  initials={doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                  status={doctor.status}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{doctor.name}</p>
                  <p className="text-xs text-gray-500">{doctor.specialty} · ext {doctor.ext}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Patients - WIDE */}
        <Card className="lg:col-span-3" padding="none">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100/60">
            <h3 className="text-sm font-semibold text-gray-900">Recent Patients</h3>
            <Link to="patients" className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-2.5">Patient</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-2.5">ID</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-2.5">Condition</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-2.5">Status</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {recentPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(`patients/${patient.id}`)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          alt={patient.name}
                          size="sm"
                          initials={patient.name.split(' ').map(n => n[0]).join('')}
                        />
                        <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500 tabular-nums">{patient.id}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-600">{patient.condition}</span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="px-3 py-3">
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <MultiStepDialog
        open={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
        steps={patientSteps}
        stepperVariant="compact"
        size="lg"
        onComplete={() => setAddPatientOpen(false)}
      >
        <MultiStepDialog.Panel step={0}>
          <MultiStepDialog.Header>
            <MultiStepDialog.Title>Patient Information</MultiStepDialog.Title>
            <MultiStepDialog.Description>
              Enter the basic patient details to create a new record.
            </MultiStepDialog.Description>
          </MultiStepDialog.Header>
          <MultiStepDialog.Body>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date of Birth" type="date" />
                <Input label="Gender" placeholder="Select gender" />
              </div>
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
              <Input label="Email" type="email" placeholder="patient@example.com" />
            </div>
          </MultiStepDialog.Body>
          <MultiStepDialog.Footer nextLabel="Continue" />
        </MultiStepDialog.Panel>

        <MultiStepDialog.Panel step={1}>
          <MultiStepDialog.Header>
            <MultiStepDialog.Title>Medical History</MultiStepDialog.Title>
            <MultiStepDialog.Description>
              Provide relevant medical history and current conditions.
            </MultiStepDialog.Description>
          </MultiStepDialog.Header>
          <MultiStepDialog.Body>
            <div className="space-y-4">
              <Textarea label="Current Conditions" placeholder="List any current medical conditions..." />
              <Textarea label="Allergies" placeholder="List any known allergies..." />
              <Input label="Blood Type" placeholder="e.g., O+" />
            </div>
          </MultiStepDialog.Body>
          <MultiStepDialog.Footer nextLabel="Continue" />
        </MultiStepDialog.Panel>

        <MultiStepDialog.Panel step={2}>
          <MultiStepDialog.Header>
            <MultiStepDialog.Title>Insurance Information</MultiStepDialog.Title>
            <MultiStepDialog.Description>
              Enter the patient's insurance coverage details.
            </MultiStepDialog.Description>
          </MultiStepDialog.Header>
          <MultiStepDialog.Body>
            <div className="space-y-4">
              <Input label="Insurance Provider" placeholder="e.g., Blue Cross" />
              <Input label="Policy Number" placeholder="Enter policy number" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Policy Holder" placeholder="If different from patient" />
                <Input label="Relationship" placeholder="e.g., Self, Spouse" />
              </div>
            </div>
          </MultiStepDialog.Body>
          <MultiStepDialog.Footer completeLabel="Add Patient" />
        </MultiStepDialog.Panel>
      </MultiStepDialog>

      <MultiStepDialog
        open={newAppointmentOpen}
        onClose={() => setNewAppointmentOpen(false)}
        steps={appointmentSteps}
        stepperVariant="compact"
        size="md"
        onComplete={() => setNewAppointmentOpen(false)}
      >
        <MultiStepDialog.Panel step={0}>
          <MultiStepDialog.Header>
            <MultiStepDialog.Title>Select Patient</MultiStepDialog.Title>
            <MultiStepDialog.Description>
              Choose the patient for this appointment.
            </MultiStepDialog.Description>
          </MultiStepDialog.Header>
          <MultiStepDialog.Body>
            <div className="space-y-3">
              <Input
                placeholder="Search by name or ID..."
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                }
              />
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <Avatar alt={patient.name} size="sm" initials={patient.name.split(' ').map(n => n[0]).join('')} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.id}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </MultiStepDialog.Body>
          <MultiStepDialog.Footer nextLabel="Continue" />
        </MultiStepDialog.Panel>

        <MultiStepDialog.Panel step={1}>
          <MultiStepDialog.Header>
            <MultiStepDialog.Title>Schedule</MultiStepDialog.Title>
            <MultiStepDialog.Description>
              Select the date and time for the appointment.
            </MultiStepDialog.Description>
          </MultiStepDialog.Header>
          <MultiStepDialog.Body>
            <div className="space-y-4">
              <Input label="Date" type="date" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Time" type="time" />
                <Input label="Duration" placeholder="30 min" />
              </div>
              <Input label="Room / Location" placeholder="e.g., Room 302" />
            </div>
          </MultiStepDialog.Body>
          <MultiStepDialog.Footer nextLabel="Continue" />
        </MultiStepDialog.Panel>

        <MultiStepDialog.Panel step={2}>
          <MultiStepDialog.Header>
            <MultiStepDialog.Title>Appointment Details</MultiStepDialog.Title>
            <MultiStepDialog.Description>
              Add any additional information about this appointment.
            </MultiStepDialog.Description>
          </MultiStepDialog.Header>
          <MultiStepDialog.Body>
            <div className="space-y-4">
              <Input label="Appointment Type" placeholder="e.g., Routine Checkup" />
              <Input label="Assigned Doctor" placeholder="Select doctor" />
              <Textarea label="Notes" placeholder="Any additional notes..." />
            </div>
          </MultiStepDialog.Body>
          <MultiStepDialog.Footer completeLabel="Create Appointment" />
        </MultiStepDialog.Panel>
      </MultiStepDialog>
    </div>
  );
}

// Compact status dot - small colored circle
function StatusDot({ status }: { status: "completed" | "confirmed" | "pending" | "cancelled" }) {
  const colors = {
    completed: "bg-emerald-400",
    confirmed: "bg-blue-400",
    pending: "bg-amber-400",
    cancelled: "bg-gray-300",
  };

  return (
    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[status]}`} />
  );
}
