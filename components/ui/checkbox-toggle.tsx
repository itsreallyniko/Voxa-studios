'use client'

interface CheckboxToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  children: React.ReactNode
  ariaLabel: string
}

export function CheckboxToggle({ checked, onChange, children, ariaLabel }: CheckboxToggleProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`text-left w-full transition-colors duration-200 border ${
        checked ? 'border-heritage-gold' : 'border-slate-gray hover:border-white/30'
      }`}
    >
      {children}
    </button>
  )
}
