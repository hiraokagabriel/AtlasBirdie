'use client'

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import type { TournamentWizardDraft } from '@atlas/types'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface WizardState {
  currentStep: number
  totalSteps: number
  draft: TournamentWizardDraft
  createdTournamentId: string | null
  createdTournamentSlug: string | null
  isSaving: boolean
  error: string | null
}

const INITIAL_STATE: WizardState = {
  currentStep: 1,
  totalSteps: 6,
  draft: {},
  createdTournamentId: null,
  createdTournamentSlug: null,
  isSaving: false,
  error: null,
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SAVE_DRAFT'; step: keyof TournamentWizardDraft; data: unknown }
  | { type: 'SET_CREATED'; id: string; slug: string }
  | { type: 'SET_SAVING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      }
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      }
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step }
    case 'SAVE_DRAFT':
      return {
        ...state,
        draft: { ...state.draft, [action.step]: action.data },
      }
    case 'SET_CREATED':
      return { ...state, createdTournamentId: action.id, createdTournamentSlug: action.slug }
    case 'SET_SAVING':
      return { ...state, isSaving: action.value }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface WizardContextValue {
  state: WizardState
  dispatch: Dispatch<WizardAction>
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider')
  return ctx
}
