'use client'

import { WizardProvider, useWizard } from './wizard-context'
import { WizardStepsBar } from './wizard-steps-bar'
import { Step1General } from './step1-general'
import { Step2Events } from './step2-events'
import { Step3Format } from './step3-format'
import { Step4Registrations } from './step4-registrations'
import { Step5Courts } from './step5-courts'
import { Step6Regulation } from './step6-regulation'

const STEP_TITLES = [
  'Informações Gerais',
  'Modalidades & Categorias',
  'Formato & Regras',
  'Inscrições',
  'Quadras',
  'Regulamento',
]

function WizardContent() {
  const { state } = useWizard()
  const { currentStep } = state

  const steps: Record<number, React.ReactNode> = {
    1: <Step1General />,
    2: <Step2Events />,
    3: <Step3Format />,
    4: <Step4Registrations />,
    5: <Step5Courts />,
    6: <Step6Regulation />,
  }

  return (
    <div className="max-w-3xl mx-auto">
      <WizardStepsBar />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">
          Etapa {currentStep}: {STEP_TITLES[currentStep - 1]}
        </h2>
        {steps[currentStep]}
      </div>
    </div>
  )
}

export function TournamentWizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
