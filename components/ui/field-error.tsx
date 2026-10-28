export function FieldError({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <p role="alert" className="text-metadata text-red-400 mt-2">
      {children}
    </p>
  )
}
