import React from 'react'
import { Check, ArrowLeft } from 'lucide-react'

interface StepperProps {
    currentStep: number
    steps: { label: string; description: string }[]
    onBack?: () => void
    action?: React.ReactNode
    showActionConnection?: boolean
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onBack, action, showActionConnection }) => {
    const [isActionHovered, setIsActionHovered] = React.useState(false)

    return (
        <div className="w-full max-w-7xl mx-auto mb-16 px-4 relative">
            <div className="max-w-4xl mx-auto relative flex justify-between items-start">

                {onBack && (
                    <button
                        onClick={onBack}
                        className="absolute left-[-80px] top-0 ai-button-circle group"
                    >
                        <ArrowLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                )}

                {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isActive = stepNumber === currentStep
                    const isCompleted = stepNumber < currentStep
                    const isLast = index === steps.length - 1

                    return (
                        <div key={index} className="flex flex-col items-center flex-1 relative">

                            {/* LIGNE DE CONNEXION (Segmentée - 6px) */}
                            {!isLast ? (
                                <div className="absolute top-6 left-[50%] w-full h-[6px] bg-white -z-0">
                                    {/* Barre de progression remplie */}
                                    <div
                                        className="h-full bg-brand-accent transition-all duration-700 ease-in-out shadow-[0_0_20px_rgba(244,208,63,0.6)]"
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            ) : (action && currentStep === 3 && showActionConnection) && (
                                <div className="absolute top-6 left-[50%] w-[200px] h-[6px] bg-white -z-0">
                                    <div
                                        className={`h-full bg-brand-accent transition-all duration-200 shadow-[0_0_20px_rgba(244,208,63,0.6)] ${isActionHovered ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                </div>
                            )}

                            {/* Circle */}
                            <div
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 z-10 
                                    ${(isCompleted || isActive || stepNumber === 1)
                                        ? 'bg-brand-accent text-black shadow-[0_0_30px_rgba(244,208,63,0.5)]'
                                        : 'bg-white text-black scale-90 border-4 border-black/10'
                                    }
                                    ${isActive ? 'scale-110 ring-4 ring-brand-accent/20' : ''}
                                `}
                            >
                                {(isCompleted) ? <Check size={24} strokeWidth={4} /> : stepNumber}
                            </div>

                            {/* Labels */}
                            <div className="text-center mt-6 transition-all duration-500">
                                <span
                                    className={`
                                        block text-[13px] font-black uppercase tracking-[0.25em] mb-1 transition-colors duration-300
                                        ${isActive || isCompleted || stepNumber === 1 ? 'text-brand-accent' : 'text-white'}
                                    `}
                                >
                                    {step.label}
                                </span>
                                <span className={`block text-[11px] tracking-widest uppercase font-bold transition-colors duration-300 ${isActive || isCompleted || stepNumber === 1 ? 'text-brand-accent/80' : 'text-white'}`}>
                                    {step.description}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {action && (
                <div
                    className="absolute -right-4 top-6 -translate-y-1/2 h-fit flex items-center"
                    onMouseEnter={() => setIsActionHovered(true)}
                    onMouseLeave={() => setIsActionHovered(false)}
                >
                    {action}
                </div>
            )}
        </div>
    )
}
