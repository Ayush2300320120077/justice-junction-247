import { CheckCircle } from 'lucide-react'

const STEP_LABELS = [
  'Personal Info',
  'Professional',
  'Practice',
  'Availability',
  'Review',
]

export default function StepProgressBar({ currentStep, totalSteps = 5 }) {
  return (
    <div className="wizard-stepper">
      <div className="wizard-stepper-label">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="wizard-stepper-track">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isActive = step === currentStep
          return (
            <div key={step} className={`wizard-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="wizard-step-circle">
                {isCompleted ? <CheckCircle size={16} /> : step}
              </div>
              <div className="wizard-step-label">{label}</div>
              {step < totalSteps && <div className={`wizard-step-line ${isCompleted ? 'filled' : ''}`} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
