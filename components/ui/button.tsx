import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const baseClass =
  'inline-flex items-center justify-center text-label-caps font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed will-change-transform'

const sizeClass: Record<Size, string> = {
  sm: 'px-6 py-3',
  md: 'px-8 py-4',
  lg: 'px-8 py-4 sm:px-12 sm:py-6',
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-ivory text-obsidian hover:bg-white shadow-2xl',
  secondary: 'border border-white/10 text-white hover:bg-white/5 frosted-glass',
  ghost: 'border border-white/10 text-white hover:border-heritage-gold hover:text-heritage-gold',
  gold: 'bg-heritage-gold text-obsidian hover:bg-[#d4b478]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      {...rest}
    />
  )
})
