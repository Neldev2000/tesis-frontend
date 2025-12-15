import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Dialog } from "./Dialog";
import { Stepper, type Step } from "./Stepper";

interface MultiStepDialogContextValue {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoBack: boolean;
}

const MultiStepDialogContext = createContext<MultiStepDialogContextValue | null>(null);

export function useMultiStepDialog() {
  const context = useContext(MultiStepDialogContext);
  if (!context) {
    throw new Error("useMultiStepDialog must be used within a MultiStepDialog");
  }
  return context;
}

type StepperVariant = "default" | "compact" | "dots" | "none";

interface MultiStepDialogProps {
  open: boolean;
  onClose: () => void;
  steps: Step[];
  children: ReactNode;
  /** Initial step (0-indexed) */
  initialStep?: number;
  /** Stepper display variant */
  stepperVariant?: StepperVariant;
  /** Allow clicking on completed steps to go back */
  allowStepClick?: boolean;
  /** Called when step changes */
  onStepChange?: (step: number) => void;
  /** Called when user completes all steps */
  onComplete?: () => void;
  /** Dialog size */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Prevent closing via backdrop click */
  persistent?: boolean;
  /** Custom class for the dialog */
  className?: string;
}

export function MultiStepDialog({
  open,
  onClose,
  steps,
  children,
  initialStep = 0,
  stepperVariant = "default",
  allowStepClick = true,
  onStepChange,
  onComplete,
  size = "md",
  persistent = false,
  className = "",
}: MultiStepDialogProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [steps.length, onStepChange]
  );

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  }, [currentStep, steps.length, goToStep, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (allowStepClick && stepIndex < currentStep) {
        goToStep(stepIndex);
      }
    },
    [allowStepClick, currentStep, goToStep]
  );

  // Reset to initial step when dialog opens
  const handleClose = useCallback(() => {
    onClose();
    // Reset after animation completes
    setTimeout(() => setCurrentStep(initialStep), 200);
  }, [onClose, initialStep]);

  const contextValue: MultiStepDialogContextValue = {
    currentStep,
    totalSteps: steps.length,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    canGoBack: currentStep > 0,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size={size}
      persistent={persistent}
      className={className}
    >
      <MultiStepDialogContext.Provider value={contextValue}>
        {/* Stepper in header area */}
        {stepperVariant !== "none" && (
          <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-gray-100">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              variant={stepperVariant === "default" ? "default" : stepperVariant}
              onStepClick={allowStepClick ? handleStepClick : undefined}
            />
          </div>
        )}

        {children}
      </MultiStepDialogContext.Provider>
    </Dialog>
  );
}

// Step Title component
interface MultiStepDialogTitleProps {
  children?: ReactNode;
  className?: string;
}

function MultiStepDialogTitle({ children, className = "" }: MultiStepDialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-midnight ${className}`}>
      {children}
    </h2>
  );
}

// Step Description component
interface MultiStepDialogDescriptionProps {
  children?: ReactNode;
  className?: string;
}

function MultiStepDialogDescription({
  children,
  className = "",
}: MultiStepDialogDescriptionProps) {
  return <p className={`mt-1 text-sm text-gray-500 ${className}`}>{children}</p>;
}

// Step Header - displays current step info
interface MultiStepDialogHeaderProps {
  children?: ReactNode;
  showClose?: boolean;
  className?: string;
}

function MultiStepDialogHeader({
  children,
  showClose = true,
  className = "",
}: MultiStepDialogHeaderProps) {
  return (
    <Dialog.Header showClose={showClose} className={className}>
      {children}
    </Dialog.Header>
  );
}

// Step Body - scrollable content area with custom scrollbar
interface MultiStepDialogBodyProps {
  children: ReactNode;
  className?: string;
}

function MultiStepDialogBody({ children, className = "" }: MultiStepDialogBodyProps) {
  return (
    <div className={`flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-2 custom-scrollbar ${className}`}>
      {children}
    </div>
  );
}

// Step Footer with navigation
interface MultiStepDialogFooterProps {
  children?: ReactNode;
  /** Text for the back button */
  backLabel?: string;
  /** Text for the next button */
  nextLabel?: string;
  /** Text for the final step button */
  completeLabel?: string;
  /** Hide the back button */
  hideBack?: boolean;
  /** Disable the next button (for validation) */
  nextDisabled?: boolean;
  /** Show loading state on next button */
  isSubmitting?: boolean;
  /** Custom handler for next/complete - return false to prevent navigation */
  onNext?: () => boolean | void | Promise<boolean | void>;
  className?: string;
}

function MultiStepDialogFooter({
  children,
  backLabel = "Back",
  nextLabel = "Continue",
  completeLabel = "Complete",
  hideBack = false,
  nextDisabled = false,
  isSubmitting = false,
  onNext,
  className = "",
}: MultiStepDialogFooterProps) {
  const { prevStep, nextStep, isFirstStep, isLastStep, canGoBack } = useMultiStepDialog();

  const handleNext = async () => {
    if (onNext) {
      const result = await onNext();
      if (result === false) return;
    }
    nextStep();
  };

  // If custom children are provided, render them instead
  if (children) {
    return <Dialog.Footer className={className}>{children}</Dialog.Footer>;
  }

  return (
    <Dialog.Footer className={className}>
      <div className="flex items-center justify-between w-full">
        <div>
          {!hideBack && canGoBack && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-midnight hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              {backLabel}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleNext}
          disabled={nextDisabled || isSubmitting}
          className={`
            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
            bg-viking-500 text-white hover:bg-viking-600
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              {isLastStep ? completeLabel : nextLabel}
              {!isLastStep && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </>
          )}
        </button>
      </div>
    </Dialog.Footer>
  );
}

// Step Panel - renders only when active, uses flex layout to contain scrollable body
interface MultiStepDialogPanelProps {
  step: number;
  children: ReactNode;
  className?: string;
}

function MultiStepDialogPanel({ step, children, className = "" }: MultiStepDialogPanelProps) {
  const { currentStep } = useMultiStepDialog();

  if (step !== currentStep) return null;

  return (
    <div className={`flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right-4 duration-200 ${className}`}>
      {children}
    </div>
  );
}

// Export as compound component
export const MultiStepDialogComponent = Object.assign(MultiStepDialog, {
  Header: MultiStepDialogHeader,
  Title: MultiStepDialogTitle,
  Description: MultiStepDialogDescription,
  Body: MultiStepDialogBody,
  Footer: MultiStepDialogFooter,
  Panel: MultiStepDialogPanel,
});

// Re-export for convenience
export { MultiStepDialogComponent as default };
