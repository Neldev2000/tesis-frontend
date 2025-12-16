import { useState } from "react";
import { Link } from "react-router";
import {
  Button,
  Card,
  Avatar,
  UserAvatar,
  StatusBadge,
  Table,
  MultiStepDialog,
  Input,
  Textarea,
  Sparkline,
  TrendIndicator,
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
    time: "09:00 AM",
    status: "completed" as const,
  },
  {
    id: 2,
    patient: "Jane Smith",
    type: "General Consultation",
    room: "Room 105",
    time: "10:30 AM",
    status: "confirmed" as const,
  },
  {
    id: 3,
    patient: "Robert Brown",
    type: "Post-Op Follow-up",
    room: "Room 204",
    time: "01:00 PM",
    status: "pending" as const,
  },
  {
    id: 4,
    patient: "Emily Davis",
    type: "Blood Work & Lab Test",
    room: "Lab A",
    time: "02:30 PM",
    status: "confirmed" as const,
  },
];

const lowStockItems = [
  { name: "Amoxicillin 500mg", category: "Antibiotics", units: 15, reorder: 20, critical: true },
  { name: "Ibuprofen 400mg", category: "Pain Relief", units: 45, reorder: 50, critical: false },
  { name: "Insulin Glargine", category: "Diabetes", units: 8, reorder: 10, critical: true },
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
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getGreeting()}, Dr. Smith
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening in your clinic today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            }
            onClick={() => setAddPatientOpen(true)}
          >
            Add Patient
          </Button>
          <Button
            variant="primary"
            size="sm"
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

      {/* Stat Cards - More refined with sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Patients */}
        <Card variant="default" padding="md">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Total Patients</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">{statsData.patients.value}</span>
                <TrendIndicator value={statsData.patients.change} direction={statsData.patients.direction} />
              </div>
            </div>
            <Sparkline data={statsData.patients.sparkline} color="success" filled className="mt-2" />
          </div>
        </Card>

        {/* Today's Appointments */}
        <Card variant="default" padding="md">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Today's Appointments</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">{statsData.appointments.value}</span>
                <span className="text-xs text-gray-400">{statsData.appointments.remaining} remaining</span>
              </div>
            </div>
            <Sparkline data={statsData.appointments.sparkline} color="default" />
          </div>
        </Card>

        {/* Inventory Alerts */}
        <Card variant="default" padding="md">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Inventory Alerts</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">{statsData.alerts.value}</span>
                <span className="text-xs text-gray-400">{statsData.alerts.label}</span>
              </div>
            </div>
            <Link
              to="inventory"
              className="text-xs font-medium text-gray-500 hover:text-gray-700 mt-2"
            >
              View all →
            </Link>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2" padding="none">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Today's Schedule</h3>
              <Link to="appointments" className="text-xs font-medium text-gray-500 hover:text-gray-700">
                View Calendar →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {todaySchedule.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <StatusDot status={appointment.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{appointment.type} • {appointment.room}</p>
                </div>
                <TimeChip time={appointment.time} status={appointment.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock */}
        <Card padding="none" className="flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-medium text-gray-900">Low Stock</h3>
              </div>
              <Link to="inventory" className="text-xs font-medium text-amber-600 hover:text-amber-700">
                Order
              </Link>
            </div>
          </div>
          <div className="flex-1 divide-y divide-gray-50">
            {lowStockItems.map((item, index) => (
              <div key={index} className="px-5 py-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold tabular-nums ${item.critical ? 'text-red-600' : 'text-amber-600'}`}>
                      {item.units} units
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Reorder: {item.reorder}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <Link
              to="inventory"
              className="block text-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              View Inventory Report
            </Link>
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <Card className="lg:col-span-2" padding="none">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Recent Patients</h3>
              <Link to="patients" className="text-xs font-medium text-gray-500 hover:text-gray-700">
                View All →
              </Link>
            </div>
          </div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Patient</Table.Head>
                <Table.Head>ID</Table.Head>
                <Table.Head>Condition</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head className="w-16">{""}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {recentPatients.map((patient) => (
                <Table.Row key={patient.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        alt={patient.name}
                        size="sm"
                        initials={patient.name.split(' ').map(n => n[0]).join('')}
                      />
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-xs text-gray-500 tabular-nums">{patient.id}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-600">{patient.condition}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={patient.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`patients/${patient.id}`}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    >
                      View
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>

        {/* Available Doctors */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Available Doctors</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {availableDoctors.map((doctor, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-3.5">
                <UserAvatar
                  name={doctor.name}
                  subtitle={`${doctor.specialty} • ${doctor.ext === "Break" ? "On Break" : `Ext ${doctor.ext}`}`}
                  size="sm"
                  status={doctor.status}
                />
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Call"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </button>
              </div>
            ))}
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
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
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

// Refined status dot - smaller and more subtle
function StatusDot({ status }: { status: "completed" | "confirmed" | "pending" | "cancelled" }) {
  const styles = {
    completed: "bg-emerald-500",
    confirmed: "bg-blue-500",
    pending: "bg-amber-500",
    cancelled: "bg-gray-400",
  };

  const icons = {
    completed: (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
    confirmed: (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    pending: (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    cancelled: (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div className={`w-6 h-6 rounded-full ${styles[status]} flex items-center justify-center flex-shrink-0`}>
      {icons[status]}
    </div>
  );
}

// Time chip component
function TimeChip({ time, status }: { time: string; status: string }) {
  const baseStyles = "text-xs font-medium px-2 py-1 rounded";

  if (status === "completed") {
    return <span className={`${baseStyles} bg-gray-100 text-gray-500`}>{time}</span>;
  }
  if (status === "pending") {
    return <span className={`${baseStyles} bg-amber-50 text-amber-700`}>{time}</span>;
  }
  return <span className={`${baseStyles} bg-blue-50 text-blue-700`}>{time}</span>;
}
