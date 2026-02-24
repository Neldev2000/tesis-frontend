# Module Template

Copy this folder to create a new module.

## Quick Start

```bash
# 1. Copy the template (or use the script)
cp -r app/modules/_template app/modules/my-module
pnpm run create-module my-module  # alternative

# 2. Rename all "template/Template" references to your module name

# 3. Register in app/modules/registry.ts:
import { moduleConfig as myModule } from "./my-module/module.config";
# Add to the modules array

# 4. Create route file: app/routes/tenant/my-module.tsx

# 5. Add route to app/routes.ts:
route("my-module", "routes/tenant/my-module.tsx"),
```

## Folder Structure

```
my-module/
├── module.config.ts      # Module metadata (REQUIRED)
├── components/           # UI components
│   ├── index.ts          # Barrel exports
│   ├── MyModuleIcon.tsx  # Sidebar icon
│   └── MyModulePage.tsx  # Main page component
├── hooks/                # Module-specific hooks (optional)
├── stores/               # Zustand stores (optional)
├── types/                # TypeScript types (optional)
└── api/                  # API calls (optional)
```

## Rules

1. **NEVER** import from other modules — only from `~/shared/`
2. Use `~/shared/components` for all UI primitives (Button, Card, Table, etc.)
3. Keep route files thin — business logic lives here in the module
4. Only create folders you actually need (don't create empty `hooks/` etc.)
