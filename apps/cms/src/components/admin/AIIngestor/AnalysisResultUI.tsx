import React from 'react'

interface AnalysisSelectorProps {
    selectedType: 'object' | 'theme' | 'creative'
    onTypeChange: (type: 'object' | 'theme' | 'creative') => void
    hasOptions: boolean
}

export const AnalysisSelector: React.FC<AnalysisSelectorProps> = ({
    selectedType,
    onTypeChange,
    hasOptions
}) => {
    if (!hasOptions) return null

    return (
        <div className="flex rounded-full gap-2 w-fit">
            {(['object', 'theme', 'creative'] as const).map((type) => (
                <button
                    key={type}
                    onClick={() => onTypeChange(type)}
                    className={`ai-button-white ${selectedType === type ? 'ai-button-active' : ''}`}
                >
                    {type}
                </button>
            ))}
        </div>
    )
}

interface AnalysisCardProps {
    title: string
    description: string
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, description }) => (
    <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col h-[350px] shrink-0">
        <h3 className="text-3xl font-black mb-3 text-white group-hover:text-brand-accent tracking-tight shrink-0 transition-colors duration-300">{title}</h3>
        <div className="h-px w-full bg-white/10 mb-4 shrink-0" />
        <div className="overflow-y-auto pr-4 custom-scrollbar flex-1 min-h-0">
            <p className="text-base text-zinc-400 group-hover:text-white font-bold leading-relaxed transition-colors duration-300">{description}</p>
        </div>
    </div>
)
