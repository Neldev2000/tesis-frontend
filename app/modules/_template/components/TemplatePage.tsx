/**
 * Main page component for this module.
 * This is imported by the route file at app/routes/tenant/<module>.tsx
 *
 * Use shared components from ~/shared/components for UI primitives.
 * Keep module-specific components in this folder.
 */
export function TemplatePage() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Template Module</h1>
        <p className="mt-2 text-gray-600">
          Replace this with your module's main content.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Getting Started
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">
            Start building your module here. Use components from{" "}
            <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">
              ~/shared/components
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
