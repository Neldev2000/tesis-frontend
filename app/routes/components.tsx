import { useState } from "react";
import {
  Button,
  Badge,
  StatusBadge,
  PriorityBadge,
  StockBadge,
  Card,
  StatCard,
  Avatar,
  AvatarGroup,
  UserAvatar,
  Tag,
  FilterPill,
  CategoryTag,
  Progress,
  StockProgress,
  CircularProgress,
  Table,
  Input,
  SearchInput,
  Textarea,
  EmptyState,
  NoResultsState,
  NoDataState,
  ErrorState,
  Dialog,
  MultiStepDialog,
  Stepper,
  type Step,
} from "~/shared/components";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-midnight mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// Steps for multi-step dialog demo
const patientSteps: Step[] = [
  { id: "info", title: "Patient Info", description: "Basic details" },
  { id: "medical", title: "Medical History", description: "Health records" },
  { id: "insurance", title: "Insurance", description: "Coverage info" },
  { id: "confirm", title: "Confirm", description: "Review & submit" },
];

export default function ComponentsShowcase() {
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [multiStepOpen, setMultiStepOpen] = useState(false);
  const [stepperDemo, setStepperDemo] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-snow">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-midnight">Component Library</h1>
          <p className="text-sm text-gray-500 mt-1">
            UI components for the Hospital Management System
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Buttons */}
        <Section title="Buttons">
          <SubSection title="Variants">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>
          </SubSection>

          <SubSection title="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </SubSection>

          <SubSection title="With Icons">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
              >
                Add New
              </Button>
              <Button
                variant="secondary"
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                }
              >
                Export
              </Button>
              <Button
                variant="ghost"
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                  </svg>
                }
                iconPosition="right"
              >
                Edit
              </Button>
            </div>
          </SubSection>

          <SubSection title="States">
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Disabled</Button>
              <Button isLoading>Loading</Button>
              <Button fullWidth className="max-w-xs">Full Width</Button>
            </div>
          </SubSection>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <SubSection title="Basic Variants">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </SubSection>

          <SubSection title="With Dot Indicator">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" dot>Online</Badge>
              <Badge variant="warning" dot>Away</Badge>
              <Badge variant="danger" dot>Busy</Badge>
            </div>
          </SubSection>

          <SubSection title="Status Badges">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="admitted" />
              <StatusBadge status="discharged" />
              <StatusBadge status="observation" />
              <StatusBadge status="critical" />
              <StatusBadge status="pending" />
              <StatusBadge status="confirmed" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="completed" />
            </div>
          </SubSection>

          <SubSection title="Priority Badges">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority="urgent" />
              <PriorityBadge priority="high" />
              <PriorityBadge priority="normal" />
              <PriorityBadge priority="low" />
            </div>
          </SubSection>

          <SubSection title="Stock Badges">
            <div className="flex flex-wrap items-center gap-2">
              <StockBadge level="high" />
              <StockBadge level="good" />
              <StockBadge level="adequate" />
              <StockBadge level="low" />
              <StockBadge level="critical" />
            </div>
          </SubSection>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <SubSection title="Basic Card">
            <Card className="max-w-md">
              <Card.Header action={<Button variant="ghost" size="sm">View All</Button>}>
                <Card.Title>Card Title</Card.Title>
                <Card.Description>This is a description of the card content.</Card.Description>
              </Card.Header>
              <Card.Body className="mt-4">
                <p className="text-sm text-gray-600">
                  Card body content goes here. You can put any content inside.
                </p>
              </Card.Body>
              <Card.Footer>
                <span className="text-xs text-gray-500">Last updated: Today</span>
                <Button size="sm">Action</Button>
              </Card.Footer>
            </Card>
          </SubSection>

          <SubSection title="Stat Cards">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Appointments Today"
                value={24}
                trend={{ value: "+15%", direction: "up" }}
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                }
                iconColor="viking"
              />
              <StatCard
                title="Pending Lab Results"
                value={5}
                subtitle="Needs Review"
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23.693L5 15.5m14.8-.2-.8.2m-13.6 0 .8.2m12-1.5.4-.1a2.25 2.25 0 0 0 1.6-2.152V9a2.25 2.25 0 0 0-2.25-2.25H6.25A2.25 2.25 0 0 0 4 9v3.248a2.25 2.25 0 0 0 1.6 2.152l.4.1" />
                  </svg>
                }
                iconColor="amber"
              />
              <StatCard
                title="Low Stock Alerts"
                value={12}
                subtitle="Needs Attention"
                trend={{ value: "-3", direction: "down" }}
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                }
                iconColor="red"
              />
              <StatCard
                title="Total Patients"
                value="1,248"
                trend={{ value: "+2.5%", direction: "up" }}
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                }
                iconColor="green"
              />
            </div>
          </SubSection>
        </Section>

        {/* Avatars */}
        <Section title="Avatars">
          <SubSection title="Sizes">
            <div className="flex items-end gap-4">
              <Avatar initials="XS" size="xs" />
              <Avatar initials="SM" size="sm" />
              <Avatar initials="MD" size="md" />
              <Avatar initials="LG" size="lg" />
              <Avatar initials="XL" size="xl" />
            </div>
          </SubSection>

          <SubSection title="With Status">
            <div className="flex items-center gap-4">
              <Avatar initials="ON" status="online" />
              <Avatar initials="OF" status="offline" />
              <Avatar initials="BU" status="busy" />
              <Avatar initials="AW" status="away" />
            </div>
          </SubSection>

          <SubSection title="Avatar Group">
            <AvatarGroup max={4}>
              <Avatar initials="JD" />
              <Avatar initials="SM" />
              <Avatar initials="AL" />
              <Avatar initials="RB" />
              <Avatar initials="KC" />
              <Avatar initials="MJ" />
            </AvatarGroup>
          </SubSection>

          <SubSection title="User Avatar">
            <div className="flex flex-col gap-4">
              <UserAvatar name="Dr. Emily White" subtitle="Pediatrics • Ext 402" status="online" />
              <UserAvatar name="Dr. James Lee" subtitle="Cardiology • Ext 210" status="busy" />
              <UserAvatar name="Dr. Sarah Connor" subtitle="Neurology • On Break" status="away" />
            </div>
          </SubSection>
        </Section>

        {/* Tags & Filters */}
        <Section title="Tags & Filters">
          <SubSection title="Basic Tags">
            <div className="flex flex-wrap items-center gap-2">
              <Tag>Default Tag</Tag>
              <Tag variant="primary">Primary Tag</Tag>
              <Tag variant="outline">Outline Tag</Tag>
              <Tag removable onRemove={() => {}}>Removable</Tag>
            </div>
          </SubSection>

          <SubSection title="Category Tags">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryTag color="blue">Pneumonia</CategoryTag>
              <CategoryTag color="red">Diabetes Type 1</CategoryTag>
              <CategoryTag color="amber">Hypertension</CategoryTag>
              <CategoryTag color="green">PCOS</CategoryTag>
              <CategoryTag color="purple">Respiratory</CategoryTag>
            </div>
          </SubSection>

          <SubSection title="Filter Pills">
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                }
              >
                All Patients
              </FilterPill>
              <FilterPill
                active={activeFilter === "inpatient"}
                onClick={() => setActiveFilter("inpatient")}
                count={42}
              >
                Inpatient
              </FilterPill>
              <FilterPill
                active={activeFilter === "outpatient"}
                onClick={() => setActiveFilter("outpatient")}
                count={156}
              >
                Outpatient
              </FilterPill>
              <FilterPill
                active={activeFilter === "critical"}
                onClick={() => setActiveFilter("critical")}
                count={8}
              >
                Critical
              </FilterPill>
            </div>
          </SubSection>
        </Section>

        {/* Progress */}
        <Section title="Progress">
          <SubSection title="Basic Progress">
            <div className="space-y-4 max-w-md">
              <Progress value={75} showLabel label="Completion" />
              <Progress value={45} variant="success" size="sm" />
              <Progress value={25} variant="warning" size="md" />
              <Progress value={10} variant="danger" size="lg" />
            </div>
          </SubSection>

          <SubSection title="Stock Progress">
            <div className="space-y-4 max-w-md">
              <StockProgress current={450} max={500} />
              <StockProgress current={85} max={150} />
              <StockProgress current={12} max={100} reorderLevel={20} />
            </div>
          </SubSection>

          <SubSection title="Circular Progress">
            <div className="flex items-center gap-6">
              <CircularProgress value={75} />
              <CircularProgress value={45} variant="success" size={64} />
              <CircularProgress value={25} variant="warning" size={80} strokeWidth={6} />
              <CircularProgress value={10} variant="danger" />
            </div>
          </SubSection>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <SubSection title="Basic Input">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Input
                label="Patient Name"
                placeholder="Enter patient name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="patient@example.com"
                hint="We'll never share your email"
              />
              <Input
                label="With Error"
                placeholder="Enter value"
                error="This field is required"
              />
              <Input
                label="Disabled"
                placeholder="Cannot edit"
                disabled
                value="Disabled input"
              />
            </div>
          </SubSection>

          <SubSection title="Search Input">
            <div className="max-w-md">
              <SearchInput
                placeholder="Search patients, medications..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue("")}
              />
            </div>
          </SubSection>

          <SubSection title="Input with Icon">
            <div className="max-w-md">
              <Input
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                }
              />
            </div>
          </SubSection>

          <SubSection title="Textarea">
            <div className="max-w-md">
              <Textarea
                label="Clinical Notes"
                placeholder="Enter clinical observations..."
                hint="Be as detailed as possible"
              />
            </div>
          </SubSection>
        </Section>

        {/* Table */}
        <Section title="Table">
          <Card padding="none">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head sortable sortDirection="asc">Patient Name</Table.Head>
                  <Table.Head>ID</Table.Head>
                  <Table.Head sortable>Condition</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <UserAvatar name="Sarah Jenkins" subtitle="MRN: 849201" size="sm" />
                  </Table.Cell>
                  <Table.Cell>#PAT-8832</Table.Cell>
                  <Table.Cell>Hypertension</Table.Cell>
                  <Table.Cell><StatusBadge status="admitted" /></Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm">View</Button>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <UserAvatar name="Michael Chen" subtitle="MRN: 849205" size="sm" />
                  </Table.Cell>
                  <Table.Cell>#PAT-8833</Table.Cell>
                  <Table.Cell>Fracture</Table.Cell>
                  <Table.Cell><StatusBadge status="discharged" /></Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm">View</Button>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <UserAvatar name="Emily Davis" subtitle="MRN: 849312" size="sm" />
                  </Table.Cell>
                  <Table.Cell>#PAT-8834</Table.Cell>
                  <Table.Cell>Diabetes Type 2</Table.Cell>
                  <Table.Cell><StatusBadge status="observation" /></Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm">View</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Table.Pagination
              currentPage={currentPage}
              totalPages={5}
              totalItems={48}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
            />
          </Card>
        </Section>

        {/* Empty States */}
        <Section title="Empty States">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <NoResultsState query="aspirin" onClear={() => {}} />
            </Card>
            <Card>
              <NoDataState
                title="No appointments"
                description="Schedule your first appointment to get started."
                actionLabel="New Appointment"
                onAction={() => {}}
              />
            </Card>
            <Card>
              <ErrorState onRetry={() => {}} />
            </Card>
          </div>
        </Section>

        {/* Stepper */}
        <Section title="Stepper">
          <SubSection title="Default Variant">
            <Card className="p-6">
              <Stepper
                steps={patientSteps}
                currentStep={stepperDemo}
                onStepClick={(step) => setStepperDemo(step)}
              />
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStepperDemo(Math.max(0, stepperDemo - 1))}
                  disabled={stepperDemo === 0}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => setStepperDemo(Math.min(patientSteps.length - 1, stepperDemo + 1))}
                  disabled={stepperDemo === patientSteps.length - 1}
                >
                  Next
                </Button>
              </div>
            </Card>
          </SubSection>

          <SubSection title="Compact Variant">
            <Card className="p-4 max-w-md">
              <Stepper steps={patientSteps} currentStep={stepperDemo} variant="compact" />
            </Card>
          </SubSection>

          <SubSection title="Dots Variant">
            <Card className="p-4 max-w-md">
              <Stepper
                steps={patientSteps}
                currentStep={stepperDemo}
                variant="dots"
                onStepClick={(step) => setStepperDemo(step)}
              />
            </Card>
          </SubSection>
        </Section>

        {/* Dialog */}
        <Section title="Dialog">
          <SubSection title="Basic Dialog">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
          </SubSection>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} size="md">
            <Dialog.Header>
              <Dialog.Title>Add New Patient</Dialog.Title>
              <Dialog.Description>
                Fill in the patient details below to create a new record.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <div className="space-y-4">
                <Input label="Full Name" placeholder="Enter patient name" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date of Birth" type="date" />
                  <Input label="Phone" placeholder="+1 (555) 000-0000" />
                </div>
                <Textarea label="Medical History" placeholder="Enter relevant medical history..." />
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Dialog.Button>
              <Dialog.Button variant="primary" onClick={() => setDialogOpen(false)}>
                Add Patient
              </Dialog.Button>
            </Dialog.Footer>
          </Dialog>

          <SubSection title="Multi-Step Dialog">
            <Button onClick={() => setMultiStepOpen(true)}>Open Multi-Step Dialog</Button>
          </SubSection>

          <MultiStepDialog
            open={multiStepOpen}
            onClose={() => setMultiStepOpen(false)}
            steps={patientSteps}
            stepperVariant="compact"
            size="lg"
            onComplete={() => {
              alert("Form completed!");
              setMultiStepOpen(false);
            }}
          >
            {/* Step 1: Patient Info */}
            <MultiStepDialog.Panel step={0}>
              <MultiStepDialog.Header>
                <MultiStepDialog.Title>Patient Information</MultiStepDialog.Title>
                <MultiStepDialog.Description>
                  Enter the basic patient details to create a new record.
                </MultiStepDialog.Description>
              </MultiStepDialog.Header>
              <MultiStepDialog.Body>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" />
                    <Input label="Last Name" placeholder="Doe" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Date of Birth" type="date" />
                    <Input label="Gender" placeholder="Select gender" />
                  </div>
                  <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                  <Input label="Email" type="email" placeholder="patient@example.com" />
                </div>
              </MultiStepDialog.Body>
              <MultiStepDialog.Footer nextLabel="Continue to Medical History" />
            </MultiStepDialog.Panel>

            {/* Step 2: Medical History */}
            <MultiStepDialog.Panel step={1}>
              <MultiStepDialog.Header>
                <MultiStepDialog.Title>Medical History</MultiStepDialog.Title>
                <MultiStepDialog.Description>
                  Provide relevant medical history and current conditions.
                </MultiStepDialog.Description>
              </MultiStepDialog.Header>
              <MultiStepDialog.Body>
                <div className="space-y-4">
                  <Textarea
                    label="Current Conditions"
                    placeholder="List any current medical conditions..."
                  />
                  <Textarea
                    label="Allergies"
                    placeholder="List any known allergies..."
                  />
                  <Textarea
                    label="Current Medications"
                    placeholder="List current medications and dosages..."
                  />
                  <Input label="Blood Type" placeholder="e.g., O+" />
                </div>
              </MultiStepDialog.Body>
              <MultiStepDialog.Footer nextLabel="Continue to Insurance" />
            </MultiStepDialog.Panel>

            {/* Step 3: Insurance */}
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
                  <Input label="Group Number" placeholder="Enter group number" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Policy Holder Name" placeholder="If different from patient" />
                    <Input label="Relationship" placeholder="e.g., Self, Spouse" />
                  </div>
                </div>
              </MultiStepDialog.Body>
              <MultiStepDialog.Footer nextLabel="Review Information" />
            </MultiStepDialog.Panel>

            {/* Step 4: Confirmation */}
            <MultiStepDialog.Panel step={3}>
              <MultiStepDialog.Header>
                <MultiStepDialog.Title>Review & Confirm</MultiStepDialog.Title>
                <MultiStepDialog.Description>
                  Please review the information before submitting.
                </MultiStepDialog.Description>
              </MultiStepDialog.Header>
              <MultiStepDialog.Body>
                <div className="space-y-4">
                  <Card className="bg-gray-50 border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Patient Name</span>
                        <span className="text-sm font-medium text-midnight">John Doe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date of Birth</span>
                        <span className="text-sm font-medium text-midnight">Jan 15, 1985</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Insurance</span>
                        <span className="text-sm font-medium text-midnight">Blue Cross</span>
                      </div>
                    </div>
                  </Card>
                  <div className="flex items-start gap-2 p-3 bg-viking-50 rounded-lg">
                    <svg className="w-5 h-5 text-viking-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p className="text-sm text-viking-700">
                      By clicking "Add Patient", you confirm that all information is accurate and consent to create this patient record.
                    </p>
                  </div>
                </div>
              </MultiStepDialog.Body>
              <MultiStepDialog.Footer completeLabel="Add Patient" />
            </MultiStepDialog.Panel>
          </MultiStepDialog>
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette">
          <SubSection title="Viking (Primary)">
            <div className="flex gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-lg bg-viking-${shade}`}
                    style={{ backgroundColor: `var(--color-viking-${shade})` }}
                  />
                  <span className="text-xs text-gray-500 mt-1">{shade}</span>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection title="Semantic Colors">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-snow border border-gray-200" />
                <span className="text-xs text-gray-500 mt-1">Snow</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-midnight" />
                <span className="text-xs text-gray-500 mt-1">Midnight</span>
              </div>
            </div>
          </SubSection>
        </Section>
      </main>
    </div>
  );
}
