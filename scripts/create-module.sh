#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────
# Module Scaffolding Script
# Creates a new module with all files, registers it automatically
# in the module registry and route config.
#
# Usage: pnpm run create-module <module-name>
# Example: pnpm run create-module billing
# Example: pnpm run create-module lab-results
# ─────────────────────────────────────────────────────────────────

if [ -z "${1:-}" ]; then
  echo "❌ Usage: pnpm run create-module <module-name>"
  echo "   Example: pnpm run create-module billing"
  exit 1
fi

MODULE_NAME="$1"
MODULE_DIR="app/modules/$MODULE_NAME"
REGISTRY_FILE="app/modules/registry.ts"
ROUTES_FILE="app/routes.ts"

# Validate name (kebab-case only)
if [[ ! "$MODULE_NAME" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "❌ Module name must be kebab-case (e.g. 'lab-results', 'billing')"
  exit 1
fi

# Check if module already exists
if [ -d "$MODULE_DIR" ]; then
  echo "❌ Module '$MODULE_NAME' already exists at $MODULE_DIR"
  exit 1
fi

# Convert kebab-case to PascalCase (e.g. lab-results → LabResults)
# Uses perl for cross-platform compatibility (macOS sed doesn't support \U)
PASCAL_NAME=$(echo "$MODULE_NAME" | perl -pe 's/(^|-)([a-z])/uc($2)/ge')

# Convert kebab-case to camelCase (e.g. lab-results → labResults)
CAMEL_NAME=$(echo "$MODULE_NAME" | perl -pe 's/-([a-z])/uc($1)/ge')

echo ""
echo "📦 Creating module: $MODULE_NAME"
echo "   PascalCase: $PASCAL_NAME"
echo "   camelCase:  $CAMEL_NAME"
echo ""

# ─────────────────────────────────────────────────
# 1. Create module files
# ─────────────────────────────────────────────────

echo "  📁 Creating module directory structure..."
mkdir -p "$MODULE_DIR/components"

# Icon component
cat > "$MODULE_DIR/components/${PASCAL_NAME}Icon.tsx" << ICONEOF
/** TODO: Replace with your module's icon from https://heroicons.com (outline style) */
export function ${PASCAL_NAME}Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  );
}
ICONEOF

# Page component
cat > "$MODULE_DIR/components/${PASCAL_NAME}Page.tsx" << PAGEEOF
/**
 * Main page component for the $MODULE_NAME module.
 * Imported by app/routes/tenant/$MODULE_NAME.tsx
 *
 * Use shared components from ~/shared/components for UI primitives.
 * Keep module-specific components in this folder.
 */
export function ${PASCAL_NAME}Page() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">$PASCAL_NAME</h1>
        <p className="mt-2 text-gray-600">
          TODO: Add module description
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Overview</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">
            Start building the $MODULE_NAME module here.
          </p>
        </div>
      </div>
    </div>
  );
}
PAGEEOF

# Barrel export
cat > "$MODULE_DIR/components/index.ts" << INDEXEOF
// Export $MODULE_NAME components here
// Example: export { ${PASCAL_NAME}Page } from './${PASCAL_NAME}Page';
INDEXEOF

# Module config (the contract)
cat > "$MODULE_DIR/module.config.ts" << CONFIGEOF
import type { ModuleConfig } from "~/shared/types/module-contract";
import { ${PASCAL_NAME}Icon } from "./components/${PASCAL_NAME}Icon";

export const moduleConfig: ModuleConfig = {
  id: "$MODULE_NAME",
  label: "$PASCAL_NAME",
  href: "$MODULE_NAME",
  icon: ${PASCAL_NAME}Icon,
  permission: "$MODULE_NAME:read",
  order: 99, // TODO: Set the desired sidebar position
  description: "TODO: Add module description",
};
CONFIGEOF

# Route file (thin — just composes module components)
cat > "app/routes/tenant/$MODULE_NAME.tsx" << ROUTEEOF
export function meta() {
  return [
    { title: "$PASCAL_NAME - Hospital Management" },
    { name: "description", content: "Manage $MODULE_NAME" },
  ];
}

export default function ${PASCAL_NAME}() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">$PASCAL_NAME</h1>
        <p className="mt-2 text-gray-600">Manage $MODULE_NAME</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Overview</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No data yet. Start building the $MODULE_NAME module.</p>
        </div>
      </div>
    </div>
  );
}
ROUTEEOF

# Module README (onboarding guide)
cat > "$MODULE_DIR/README.md" << READMEEOF
# $PASCAL_NAME Module

> TODO: Describe what this module does in 1-2 sentences.

## Getting Started

This module was scaffolded with \`pnpm run create-module $MODULE_NAME\`.
It is already registered in the sidebar navigation and route config.

### Key Files

| File | Purpose |
|------|---------|
| \`module.config.ts\` | Module metadata (name, icon, permission, sidebar order) |
| \`components/${PASCAL_NAME}Icon.tsx\` | Sidebar icon — replace with one from [heroicons.com](https://heroicons.com) |
| \`components/${PASCAL_NAME}Page.tsx\` | Main page component |
| \`components/index.ts\` | Barrel exports for this module's components |

### Optional Folders

Create these as needed (don't create empty folders):

| Folder | When to Create |
|--------|----------------|
| \`hooks/\` | Module-specific React hooks |
| \`stores/\` | Zustand stores for module state |
| \`types/\` | TypeScript interfaces and types |
| \`api/\` | API calls and React Query hooks |
| \`utils/\` | Module-specific utility functions |

## Architecture Rules

1. **NEVER** import from other modules — only from \`~/shared/\`
2. Use \`~/shared/components\` for all UI primitives (Button, Card, Table, etc.)
3. Keep route files thin — business logic lives here in the module
4. Only create sub-folders you actually need

## Available Shared Components

Import from \`~/shared/components\`:

- **Layout**: \`TenantLayout\`, \`Sidebar\`, \`Header\`
- **UI**: \`Button\`, \`Card\`, \`Badge\`, \`Avatar\`, \`Tag\`, \`Progress\`
- **Forms**: \`Input\`, \`Select\`, \`Combobox\`, \`Checkbox\`, \`Switch\`, \`FileUpload\`
- **Data**: \`Table\`, \`DataTable\`, \`EditableTable\`
- **Feedback**: \`Dialog\`, \`MultiStepDialog\`, \`EmptyState\`
- **Viz**: \`Sparkline\`, \`MiniBarChart\`, \`ProgressRing\`, \`TrendIndicator\`

## Example: Adding a List View

\`\`\`tsx
// components/${PASCAL_NAME}List.tsx
import { Card, Table, Badge, SearchInput } from "~/shared/components";

export function ${PASCAL_NAME}List() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>All Items</Card.Title>
        <SearchInput placeholder="Search..." onChange={() => {}} />
      </Card.Header>
      <Card.Body noPadding>
        {/* Add your Table here */}
      </Card.Body>
    </Card>
  );
}
\`\`\`

Then update the route to use it:

\`\`\`tsx
// app/routes/tenant/$MODULE_NAME.tsx
import { ${PASCAL_NAME}List } from "~/modules/$MODULE_NAME/components/${PASCAL_NAME}List";

export default function ${PASCAL_NAME}() {
  return <${PASCAL_NAME}List />;
}
\`\`\`
READMEEOF

echo "  ✅ Module files created"

# ─────────────────────────────────────────────────
# 2. Auto-register in registry.ts
# ─────────────────────────────────────────────────

echo "  📝 Registering in module registry..."

# Insert import line before the sentinel comment
sed -i '' "s|// Add new module imports above this line|import { moduleConfig as ${CAMEL_NAME} } from \"./${MODULE_NAME}/module.config\";\n// Add new module imports above this line|" "$REGISTRY_FILE"

# Insert module into the array before the sentinel comment
sed -i '' "s|  // Add new modules above this line|  ${CAMEL_NAME},\n  // Add new modules above this line|" "$REGISTRY_FILE"

echo "  ✅ Registered in $REGISTRY_FILE"

# ─────────────────────────────────────────────────
# 3. Auto-register in routes.ts
# ─────────────────────────────────────────────────

echo "  📝 Registering route..."

# Insert route line before the sentinel comment
sed -i '' "s|    // Add new module routes above this line|    route(\"${MODULE_NAME}\", \"routes/tenant/${MODULE_NAME}.tsx\"),\n    // Add new module routes above this line|" "$ROUTES_FILE"

echo "  ✅ Registered in $ROUTES_FILE"

# ─────────────────────────────────────────────────
# Done!
# ─────────────────────────────────────────────────

echo ""
echo "┌──────────────────────────────────────────────────┐"
echo "│  ✅ Module '$MODULE_NAME' created and registered! │"
echo "└──────────────────────────────────────────────────┘"
echo ""
echo "  What was done automatically:"
echo "    ✓ Module files created at $MODULE_DIR/"
echo "    ✓ Registered in $REGISTRY_FILE (sidebar navigation)"
echo "    ✓ Route added to $ROUTES_FILE"
echo "    ✓ README.md generated with onboarding guide"
echo ""
echo "  What to do next:"
echo "    1. Pick an icon from https://heroicons.com"
echo "       → Edit $MODULE_DIR/components/${PASCAL_NAME}Icon.tsx"
echo ""
echo "    2. Set sidebar order in module.config.ts"
echo "       → Change 'order: 99' to desired position (lower = higher)"
echo ""
echo "    3. Start building components in $MODULE_DIR/components/"
echo "       → Read $MODULE_DIR/README.md for examples and rules"
echo ""
echo "    4. Run 'pnpm run dev' to see your module in the sidebar"
echo ""
