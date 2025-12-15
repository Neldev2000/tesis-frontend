# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-tenant hospital management SaaS application built with React Router v7 and TypeScript. It follows a screaming architecture pattern with feature-based modules for inventory, appointments, and patients management.

## Development Commands

- **Development server**: `pnpm run dev` - Starts dev server with HMR at http://localhost:5173
- **Build**: `pnpm run build` - Creates production build
- **Type checking**: `pnpm run typecheck` - Runs React Router type generation and TypeScript compiler
- **Production server**: `pnpm run start` - Serves the built application

## Architecture Overview

This application follows **Screaming Architecture** principles where the codebase structure screams its business domain (hospital management) rather than technical details.

### Core Technologies
- **React Router v7**: Full-stack React framework with SSR enabled
- **TypeScript**: Strict mode with ES2022 target
- **TailwindCSS**: Utility-first CSS framework
- **React Query (@tanstack/react-query)**: Server state management
- **Zustand**: Client-side state management
- **Vite**: Build tool and dev server

### Multi-Tenant Structure

The application supports multiple tenants (hospitals) with the following route structure:
- `/login` - Authentication
- `/hospitals` - Tenant selection
- `/{tenantId}/dashboard` - Tenant-specific dashboard
- `/{tenantId}/inventory` - Inventory management
- `/{tenantId}/appointments` - Appointment scheduling
- `/{tenantId}/patients` - Patient records

### Directory Structure

```
app/
├── shared/                     # Cross-cutting concerns
│   ├── components/            # Reusable UI components (Button, Modal, etc.)
│   ├── hooks/                 # Shared custom hooks (useAuth, useApi, etc.)
│   ├── stores/                # Global state (auth, tenant, theme)
│   ├── utils/                 # Utility functions (formatters, validators)
│   └── types/                 # Shared TypeScript types
├── modules/                   # Business feature modules
│   ├── inventory/
│   │   ├── components/        # Inventory-specific components
│   │   ├── hooks/             # Inventory business logic hooks
│   │   ├── stores/            # Inventory state management
│   │   └── types/             # Inventory domain types
│   ├── appointments/
│   │   ├── components/        # Appointment-specific components
│   │   ├── hooks/             # Appointment business logic
│   │   ├── stores/            # Appointment state
│   │   └── types/             # Appointment types
│   └── patients/
│       ├── components/        # Patient-specific components
│       ├── hooks/             # Patient business logic
│       ├── stores/            # Patient state
│       └── types/             # Patient types
└── routes/                    # Route components (thin orchestration layer)
    ├── auth/login.tsx         # Authentication page
    ├── hospitals/index.tsx    # Tenant selection
    ├── tenant/                # Tenant-specific routes
    │   ├── layout.tsx         # Tenant layout wrapper
    │   ├── dashboard.tsx      # Main dashboard
    │   ├── appointments.tsx   # Appointments page
    │   ├── inventory.tsx      # Inventory page
    │   └── patients.tsx       # Patients page
    └── home.tsx               # Landing page
```

## Working with the Architecture

### Adding New Features

1. **Identify the Domain**: Determine which module the feature belongs to (inventory, appointments, patients)

2. **Create Components**: Add components to the appropriate module's `components/` directory
   ```typescript
   // app/modules/inventory/components/InventoryList.tsx
   export function InventoryList() { ... }
   ```

3. **Add Business Logic**: Create hooks in the module's `hooks/` directory
   ```typescript
   // app/modules/inventory/hooks/useInventoryItems.ts
   export function useInventoryItems() { ... }
   ```

4. **State Management**: Add stores in the module's `stores/` directory using Zustand
   ```typescript
   // app/modules/inventory/stores/inventoryStore.ts
   export const useInventoryStore = create(() => ({ ... }))
   ```

5. **Define Types**: Add TypeScript types in the module's `types/` directory
   ```typescript
   // app/modules/inventory/types/index.ts
   export interface InventoryItem { ... }
   ```

6. **Export from Index**: Always export from the module's index files
   ```typescript
   // app/modules/inventory/components/index.ts
   export { InventoryList } from './InventoryList';
   ```

### Cross-Module Dependencies

- **Allowed**: Modules can import from `shared/`
- **Not Allowed**: Modules should NOT import from other modules directly
- **Communication**: Use shared stores or props for inter-module communication

### Shared vs Module Code

**Use `shared/` for:**
- Reusable UI components (Button, Modal, Form inputs)
- Authentication logic
- API utilities
- Common types (User, ApiResponse)
- Theme and styling utilities

**Use `modules/` for:**
- Domain-specific business logic
- Feature-specific components
- Module-specific state management
- Domain types and interfaces

### File Naming Conventions

- **Components**: PascalCase (`InventoryList.tsx`)
- **Hooks**: camelCase starting with "use" (`useInventoryItems.ts`)
- **Stores**: camelCase ending with "Store" (`inventoryStore.ts`)
- **Types**: camelCase (`inventoryTypes.ts`) or PascalCase interfaces
- **Utils**: camelCase (`dateUtils.ts`)

### Import Patterns

```typescript
// Import from shared
import { Button } from '~/shared/components';
import { useAuth } from '~/shared/hooks';
import { authStore } from '~/shared/stores';

// Import from same module
import { InventoryList } from '../components/InventoryList';
import { useInventoryItems } from '../hooks/useInventoryItems';

// Import from other modules (avoid - use shared instead)
// ❌ import { PatientCard } from '~/modules/patients/components';
```

## Development Guidelines

1. **Module Isolation**: Keep modules independent and self-contained
2. **Thin Routes**: Route components should be thin orchestration layers
3. **Business Logic in Hooks**: Keep complex logic in custom hooks
4. **Shared First**: Always check if something belongs in `shared/` before creating module-specific code
5. **Type Safety**: Use TypeScript strictly, define proper interfaces
6. **Testing**: Test business logic hooks and shared utilities

## Multi-Tenancy Considerations

- Tenant context is available through the route parameter `:tenantId`
- Use tenant-aware stores and API calls
- Ensure data isolation between tenants
- Consider tenant-specific theming and branding

## UI Component Library

The project includes a custom component library in `app/shared/components/`. **Always use these components instead of creating new ones or using raw HTML elements.**

### Design System Colors

Custom Tailwind colors defined in `app/app.css`:

- **viking** (primary): `viking-50` to `viking-950` - Teal/cyan brand color
- **snow**: `#FBFFFE` - Light background
- **midnight**: `#0D1B2A` - Dark text/background

```typescript
// Usage examples
className="bg-viking-500 text-white"
className="bg-snow text-midnight"
className="border-viking-300 hover:border-viking-400"
```

### Available Components

Import all components from `~/shared/components`:

```typescript
import {
  // Layout
  Sidebar, Header, TenantLayout,

  // Dialogs
  Dialog, SearchDialog, MultiStepDialog, Stepper,

  // UI Components
  Button, Badge, Card, StatCard, Avatar, AvatarGroup, UserAvatar,
  Tag, FilterPill, CategoryTag, Progress, StockProgress, CircularProgress,
  Table, Input, SearchInput, Textarea,
  EmptyState, NoResultsState, NoDataState, ErrorState,

  // Preset Badges
  StatusBadge, PriorityBadge, StockBadge,
} from "~/shared/components";
```

### Component Usage Guide

#### Button
```typescript
<Button variant="primary" size="md" icon={<Icon />} loading={false}>
  Click me
</Button>
// Variants: primary, secondary, ghost, danger, success
// Sizes: sm, md, lg
```

#### Badge & Preset Badges
```typescript
<Badge variant="success">Active</Badge>
<StatusBadge status="admitted" />      // admitted, discharged, observation, critical, pending, confirmed, cancelled, completed
<PriorityBadge priority="urgent" />    // urgent, high, normal, low
<StockBadge level="low" />             // high, good, adequate, low, critical
```

#### Card (Compound Component)
```typescript
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

<StatCard
  title="Total Patients"
  value="1,234"
  trend={{ value: 12, direction: "up" }}
  icon={<UsersIcon />}
/>
```

#### Dialog (Compound Component)
```typescript
<Dialog open={isOpen} onClose={() => setIsOpen(false)} size="md">
  <Dialog.Header>
    <Dialog.Title>Dialog Title</Dialog.Title>
    <Dialog.Description>Optional description</Dialog.Description>
  </Dialog.Header>
  <Dialog.Body>Content here</Dialog.Body>
  <Dialog.Footer>
    <Dialog.Button variant="secondary" onClick={onClose}>Cancel</Dialog.Button>
    <Dialog.Button variant="primary" onClick={onSubmit}>Confirm</Dialog.Button>
  </Dialog.Footer>
</Dialog>
// Sizes: sm, md, lg, xl, full
// Renders as drawer on mobile, modal on desktop
```

#### MultiStepDialog (for multi-step forms)
```typescript
const steps: Step[] = [
  { id: "info", title: "Info", description: "Basic details" },
  { id: "review", title: "Review", description: "Confirm" },
];

<MultiStepDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  steps={steps}
  stepperVariant="compact"  // default, compact, dots, none
  onComplete={() => handleSubmit()}
>
  <MultiStepDialog.Panel step={0}>
    <MultiStepDialog.Header>
      <MultiStepDialog.Title>Step 1</MultiStepDialog.Title>
    </MultiStepDialog.Header>
    <MultiStepDialog.Body>Form fields...</MultiStepDialog.Body>
    <MultiStepDialog.Footer nextLabel="Continue" />
  </MultiStepDialog.Panel>

  <MultiStepDialog.Panel step={1}>
    {/* Step 2 content */}
  </MultiStepDialog.Panel>
</MultiStepDialog>
```

#### Table (Compound Component)
```typescript
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head sortable onSort={() => {}}>Name</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell><StatusBadge status="admitted" /></Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Pagination
    currentPage={1}
    totalPages={10}
    onPageChange={setPage}
  />
</Table>
```

#### Input Components
```typescript
<Input
  label="Email"
  error="Invalid email"
  hint="We'll never share your email"
  icon={<MailIcon />}
  inputSize="md"  // sm, md, lg
/>

<SearchInput
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onClear={() => setQuery("")}
  placeholder="Search patients..."
/>

<Textarea label="Notes" rows={4} />
```

#### Empty States
```typescript
<NoResultsState query="search term" onClear={() => clearSearch()} />
<NoDataState
  title="No patients yet"
  description="Get started by adding your first patient"
  actionLabel="Add Patient"
  onAction={() => openDialog()}
/>
<ErrorState title="Failed to load" onRetry={() => refetch()} />
```

#### Avatar
```typescript
<Avatar src="/photo.jpg" alt="John" size="md" status="online" />
<AvatarGroup max={3}>
  <Avatar src="/1.jpg" />
  <Avatar src="/2.jpg" />
  <Avatar src="/3.jpg" />
</AvatarGroup>
<UserAvatar name="Dr. Smith" subtitle="Cardiologist" src="/photo.jpg" />
```

#### Progress
```typescript
<Progress value={75} max={100} size="md" color="viking" showLabel />
<StockProgress current={15} min={10} max={100} />  // Auto color-coded
<CircularProgress value={80} size={60} strokeWidth={4} />
```

### Custom CSS Classes

Available in `app/app.css`:

```typescript
// Custom scrollbars (use on scrollable containers)
className="custom-scrollbar"        // Viking-colored scrollbar
className="custom-scrollbar-subtle" // Subtle gray scrollbar

// Animations
className="animate-in fade-in"
className="animate-in zoom-in-95"
className="animate-in slide-up"
```

### Component Showcase

Visit `/components` in development to see all components with live examples.