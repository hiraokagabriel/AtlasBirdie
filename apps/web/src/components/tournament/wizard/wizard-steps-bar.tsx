'use client'

import { cn } from '@/lib/utils'
import { useWizard } from './wizard-context'
import { Check } from 'lucide-react'

const STEPS = [
  { label: 'Informações Gerais' },
  { label: 'Modalidades' },
  { label: 'Formato' },
  { label: 'Inscrições' },
  { label: 'Quadras' },
  { label: 'Regulamento' },
]

export function WizardStepsBar() {
  const { state, dispatch } = useWizard()
  const { currentStep } = state

  return (
    <nav aria-label="Etapas do wizard" className="mb-8">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep

          return (
            <li key={stepNumber} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() =>
                  stepNumber < currentStep
                    ? dispatch({ type: 'GO_TO_STEP', step: stepNumber })
                    : undefined
                }
                disabled={stepNumber > currentStep}
                className={cn(
                  'flex flex-col items-center gap-1.5 group',
                  stepNumber <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                    isCompleted &&
                      'bg-[var(--color-primary)] border-[var(--color-primary)] text-white',
                    isActive &&
                      'bg-white border-[var(--color-primary)] text-[var(--color-primary)]',
                    !isCompleted &&
                      !isActive &&
                      'bg-white border-[var(--color-border)] text-[var(--color-text-muted)]',
                  )}
                >
                  {isCompleted ? <Check size={14} /> : stepNumber}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block',
                    isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]',
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Conector */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-px mx-2',
                    stepNumber < currentStep
                      ? 'bg-[var(--color-primary)]'
                      : 'bg-[var(--color-border)]',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
