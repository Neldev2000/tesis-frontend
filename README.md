# Hospital Management System - Frontend

Sistema de gestión hospitalaria multi-tenant construido con React Router v7 y TypeScript.

## Tech Stack

| Tecnología | Uso | Documentación |
|------------|-----|---------------|
| [React Router v7](https://reactrouter.com/start/framework/installation) | Framework full-stack con SSR | [Docs](https://reactrouter.com/start/framework/routing) |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático | [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| [TailwindCSS](https://tailwindcss.com/) | Estilos utility-first | [Docs](https://tailwindcss.com/docs) |
| [Zustand](https://zustand-demo.pmnd.rs/) | Estado del cliente | [Docs](https://docs.pmnd.rs/zustand/getting-started/introduction) |
| [TanStack Query](https://tanstack.com/query/latest) | Estado del servidor / Data fetching | [Docs](https://tanstack.com/query/latest/docs/framework/react/overview) |
| [React Hook Form](https://react-hook-form.com/) | Manejo de formularios | [Docs](https://react-hook-form.com/get-started) |

## Comandos

```bash
pnpm install      # Instalar dependencias
pnpm run dev      # Servidor de desarrollo (http://localhost:5173)
pnpm run build    # Build de producción
pnpm run typecheck # Verificar tipos
```

## Arquitectura

Seguimos **Screaming Architecture**: la estructura del código refleja el dominio del negocio.

```
app/
├── shared/                 # Código compartido
│   ├── components/        # Componentes UI reutilizables
│   ├── hooks/             # Hooks compartidos
│   ├── stores/            # Estado global (auth, tenant)
│   └── types/             # Tipos compartidos
├── modules/               # Módulos de negocio
│   ├── inventory/
│   ├── appointments/
│   └── patients/
└── routes/                # Rutas (capa delgada)
```

---

## Guía: Crear un Módulo desde Cero

### 1. Estructura del Módulo

Crea la siguiente estructura en `app/modules/`:

```
app/modules/tu-modulo/
├── components/
│   ├── index.ts           # Re-exports
│   └── TuComponente.tsx
├── hooks/
│   ├── index.ts
│   └── useTusDatos.ts
├── stores/
│   ├── index.ts
│   └── tuModuloStore.ts
└── types/
    └── index.ts
```

### 2. Definir Tipos

```typescript
// app/modules/tu-modulo/types/index.ts
export interface Item {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CreateItemDto {
  name: string;
}
```

### 3. Crear el Store (Zustand)

Para estado del **cliente** (UI state, filtros, selección):

```typescript
// app/modules/tu-modulo/stores/tuModuloStore.ts
import { create } from "zustand";

interface TuModuloState {
  // Estado
  selectedIds: string[];
  filters: { search: string; status: string };

  // Acciones
  setSelectedIds: (ids: string[]) => void;
  setFilters: (filters: Partial<TuModuloState["filters"]>) => void;
  reset: () => void;
}

const initialState = {
  selectedIds: [],
  filters: { search: "", status: "all" },
};

export const useTuModuloStore = create<TuModuloState>((set) => ({
  ...initialState,

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  reset: () => set(initialState),
}));
```

**Cuándo usar Zustand:**
- Filtros de búsqueda
- Items seleccionados
- Estado de UI (modales abiertos, tabs activos)
- Estado que persiste entre navegaciones

### 4. Crear Hooks de Data Fetching (TanStack Query)

Para estado del **servidor** (datos de la API):

```typescript
// app/modules/tu-modulo/hooks/useItems.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item, CreateItemDto } from "../types";

// API functions
const fetchItems = async (tenantId: string): Promise<Item[]> => {
  const res = await fetch(`/api/${tenantId}/items`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const createItem = async (tenantId: string, data: CreateItemDto): Promise<Item> => {
  const res = await fetch(`/api/${tenantId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
};

// Hooks
export function useItems(tenantId: string) {
  return useQuery({
    queryKey: ["items", tenantId],
    queryFn: () => fetchItems(tenantId),
  });
}

export function useCreateItem(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemDto) => createItem(tenantId, data),
    onSuccess: () => {
      // Invalidar cache para refetch automático
      queryClient.invalidateQueries({ queryKey: ["items", tenantId] });
    },
  });
}
```

**Cuándo usar TanStack Query:**
- Fetch de datos de la API
- Mutations (crear, actualizar, eliminar)
- Cache automático
- Loading/error states

### 5. Crear Componentes

```typescript
// app/modules/tu-modulo/components/ItemList.tsx
import { useItems } from "../hooks";
import { useTuModuloStore } from "../stores";
import { Card, Table, Badge, SearchInput, Button } from "~/shared/components";

interface ItemListProps {
  tenantId: string;
}

export function ItemList({ tenantId }: ItemListProps) {
  // Data del servidor
  const { data: items, isLoading, error } = useItems(tenantId);

  // Estado del cliente
  const { filters, setFilters, selectedIds, setSelectedIds } = useTuModuloStore();

  // Filtrar items
  const filteredItems = items?.filter((item) =>
    item.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        onClear={() => setFilters({ search: "" })}
      />

      <Card padding="none">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Status</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredItems?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  <Badge variant={item.status === "active" ? "success" : "default"}>
                    {item.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
```

### 6. Crear Formularios (React Hook Form)

```typescript
// app/modules/tu-modulo/components/ItemForm.tsx
import { useForm, Controller } from "react-hook-form";
import { useCreateItem } from "../hooks";
import {
  Input,
  Select,
  Button,
  Dialog,
  type SelectOption
} from "~/shared/components";

interface ItemFormData {
  name: string;
  category: string;
}

const categoryOptions: SelectOption[] = [
  { value: "cat1", label: "Category 1" },
  { value: "cat2", label: "Category 2" },
];

interface ItemFormProps {
  tenantId: string;
  open: boolean;
  onClose: () => void;
}

export function ItemForm({ tenantId, open, onClose }: ItemFormProps) {
  const createItem = useCreateItem(tenantId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>();

  const onSubmit = async (data: ItemFormData) => {
    await createItem.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>New Item</Dialog.Title>
      </Dialog.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Body className="space-y-4">
          {/* Input nativo - usar register */}
          <Input
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          {/* Componente custom - usar Controller */}
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <Select
                label="Category"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
              />
            )}
          />
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Button variant="secondary" onClick={onClose}>
            Cancel
          </Dialog.Button>
          <Dialog.Button
            type="submit"
            variant="primary"
            disabled={createItem.isPending}
          >
            {createItem.isPending ? "Creating..." : "Create"}
          </Dialog.Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  );
}
```

#### Referencia de Componentes para Forms

| Componente | Registro | Ejemplo |
|------------|----------|---------|
| `Input`, `Textarea`, `EmailInput`, `PasswordInput` | `{...register("field")}` | `<Input {...register("name")} />` |
| `DateInput`, `TimeInput` | `{...register("field")}` | `<DateInput {...register("date")} />` |
| `Checkbox` | `{...register("field")}` | `<Checkbox {...register("agree")} />` |
| `NumberInput`, `CurrencyInput` | `Controller` | Ver ejemplo arriba |
| `Select`, `Combobox`, `MultiSelect` | `Controller` | Ver ejemplo arriba |
| `Switch`, `RadioGroup` | `Controller` | Ver ejemplo arriba |

### 7. Crear la Ruta

```typescript
// app/routes/tenant/tu-modulo.tsx
import { useParams } from "react-router";
import { ItemList, ItemForm } from "~/modules/tu-modulo/components";
import { Button } from "~/shared/components";
import { useState } from "react";

export function meta() {
  return [{ title: "Tu Módulo - Hospital Management" }];
}

export default function TuModuloPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [formOpen, setFormOpen] = useState(false);

  if (!tenantId) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Tu Módulo</h1>
        <Button onClick={() => setFormOpen(true)}>Add New</Button>
      </div>

      <ItemList tenantId={tenantId} />

      <ItemForm
        tenantId={tenantId}
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
}
```

---

## Componentes Disponibles

Visita `/components` en desarrollo para ver todos los componentes con ejemplos.

### Importación

```typescript
import {
  // Layout
  Button, Card, StatCard,

  // Data Display
  Badge, StatusBadge, PriorityBadge,
  Table, DataTable, EditableTable,
  Avatar, UserAvatar,
  Progress, StockProgress,

  // Forms
  Input, SearchInput, Textarea,
  NumberInput, CurrencyInput,
  EmailInput, PasswordInput, PhoneInput,
  DateInput, TimeInput,
  Select, Combobox, MultiSelect, Autocomplete,
  Checkbox, RadioGroup, Switch,
  FileUpload, ImageUpload,

  // Feedback
  Dialog, MultiStepDialog,
  EmptyState, NoResultsState, ErrorState,
} from "~/shared/components";
```

---

## Recursos de Aprendizaje

### React & TypeScript
- [React Docs](https://react.dev/learn)
- [TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)

### Estado & Data Fetching
- [Zustand Tutorial](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)

### Formularios
- [React Hook Form - Get Started](https://react-hook-form.com/get-started)
- [Form Validation](https://react-hook-form.com/get-started#Applyvalidation)
- [Controller API](https://react-hook-form.com/docs/usecontroller/controller)

### Estilos
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

### React Router v7
- [Framework Mode](https://reactrouter.com/start/framework/installation)
- [Routing](https://reactrouter.com/start/framework/routing)
- [Data Loading](https://reactrouter.com/start/framework/data-loading)

---

## Reglas Importantes

1. **No importar entre módulos** - Solo importar desde `shared/`
2. **Rutas delgadas** - La lógica va en hooks y componentes del módulo
3. **Usar componentes existentes** - No crear componentes UI desde cero
4. **Tipar todo** - Interfaces para props, datos, y estado
5. **Zustand para UI state** - Filtros, selección, modales
6. **TanStack Query para server state** - Datos de la API
