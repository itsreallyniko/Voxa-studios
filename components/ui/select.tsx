import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  placeholder?: string
}

const baseField =
  'w-full bg-transparent border-0 border-b border-slate-gray text-ivory text-body-md py-3 outline-none transition-colors duration-200 focus:border-heritage-gold appearance-none pr-8'

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, className = '', id, ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-label-caps text-ivory/60">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={`${baseField} ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" className="bg-obsidian text-ivory/60">
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-obsidian text-ivory">
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ivory/50"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  )
})
