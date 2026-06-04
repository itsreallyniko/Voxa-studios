import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {}
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {}

const baseField =
  'w-full bg-transparent border-0 border-b border-slate-gray text-ivory text-body-md py-3 outline-none transition-colors duration-200 focus:border-heritage-gold placeholder:text-ivory/30'

export const Input = forwardRef<HTMLInputElement, InputFieldProps>(function Input(
  { label, className = '', id, ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-label-caps text-ivory/60">
        {label}
      </label>
      <input ref={ref} id={inputId} className={`${baseField} ${className}`} {...rest} />
    </div>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function Textarea(
  { label, className = '', id, ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={inputId} className="text-label-caps text-ivory/60">
        {label}
      </label>
      <textarea ref={ref} id={inputId} rows={3} className={`${baseField} resize-none ${className}`} {...rest} />
    </div>
  )
})
