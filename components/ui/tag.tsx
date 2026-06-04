import { HTMLAttributes } from 'react'

export function Tag({ className = '', ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex px-4 py-1.5 rounded-full border border-white/10 text-metadata text-ivory/60 ${className}`}
      {...rest}
    />
  )
}
