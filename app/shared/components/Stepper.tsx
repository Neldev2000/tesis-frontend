import type { ReactNode } from "react";

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

type StepperVariant = "default" | "compact" | "dots";

interface StepperProps {
  steps: Step[];
  currentStep: number;
  variant?: StepperVariant;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  variant = "default",
  onStepClick,
  className = "",
}: StepperProps) {
  if (variant === "dots") {
    return (
      <DotsVariant
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
        className={className}
      />
    );
  }

  if (variant === "compact") {
    return (
      <CompactVariant
        steps={steps}
        currentStep={currentStep}
        className={className}
      />
    );
  }

  return (
    <DefaultVariant
      steps={steps}
      currentStep={currentStep}
      onStepClick={onStepClick}
      className={className}
    />
  );
}

function DefaultVariant({
  steps,
  currentStep,
  onStepClick,
  className,
}: Omit<StepperProps, "variant">) {
  return (
    <nav className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index < currentStep;

          return (
            <li
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-3 group
                  ${isClickable ? "cursor-pointer" : "cursor-default"}
                `}
              >
                {/* Step indicator */}
                <span
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    transition-colors flex-shrink-0
                    ${
                      isCompleted
                        ? "bg-viking-500 text-white"
                        : isCurrent
                          ? "bg-viking-500 text-white ring-4 ring-viking-100"
                          : "bg-gray-100 text-gray-500"
                    }
                    ${isClickable ? "group-hover:bg-viking-600" : ""}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : step.icon ? (
                    <span className="w-4 h-4">{step.icon}</span>
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Step content */}
                <span className="hidden sm:block">
                  <span
                    className={`
                      block text-sm font-medium
                      ${isCurrent ? "text-viking-600" : isCompleted ? "text-gray-900" : "text-gray-500"}
                    `}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {step.description}
                    </span>
                  )}
                </span>
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4
                    ${isCompleted ? "bg-viking-500" : "bg-gray-200"}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function CompactVariant({
  steps,
  currentStep,
  className,
}: Omit<StepperProps, "variant" | "onStepClick">) {
  const currentStepData = steps[currentStep];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <span className="text-xs text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </span>
        <h4 className="text-sm font-medium text-gray-900">{currentStepData?.title}</h4>
      </div>
      <div className="flex gap-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`
              h-1 w-6 rounded-full transition-colors
              ${index <= currentStep ? "bg-viking-500" : "bg-gray-200"}
            `}
          />
        ))}
      </div>
    </div>
  );
}

function DotsVariant({
  steps,
  currentStep,
  onStepClick,
  className,
}: Omit<StepperProps, "variant">) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index < currentStep;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={`
              rounded-full transition-all
              ${isCurrent ? "w-6 h-2 bg-viking-500" : "w-2 h-2"}
              ${isCompleted ? "bg-viking-500" : !isCurrent ? "bg-gray-300" : ""}
              ${isClickable ? "cursor-pointer hover:bg-viking-400" : "cursor-default"}
            `}
            aria-label={`Step ${index + 1}: ${step.title}`}
          />
        );
      })}
    </div>
  );
}

// Step content wrapper - for use in MultiStepDialog
interface StepContentProps {
  children: ReactNode;
  className?: string;
}

export function StepContent({ children, className = "" }: StepContentProps) {
  return (
    <div className={`animate-in fade-in duration-200 ${className}`}>
      {children}
    </div>
  );
}
