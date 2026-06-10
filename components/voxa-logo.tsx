import type { SVGProps } from 'react'

export function VoxaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 50"
      role="img"
      aria-label="Voxa Studios"
      {...props}
    >
      <polygon points="0,0 15,0 36,50 21,50" fill="currentColor" />
      <polygon points="50,0 65,0 44,50 29,50" fill="currentColor" />
      <line x1="78" y1="4" x2="78" y2="46" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
      <text x="90" y="25" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="16" fontWeight="400" letterSpacing="4" fill="currentColor">VOXA</text>
      <text x="91" y="40" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="8" fontWeight="300" letterSpacing="4" fill="#C9A96E">STUDIOS</text>
    </svg>
  )
}
