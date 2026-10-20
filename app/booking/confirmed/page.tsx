import type { Metadata } from 'next'
import { ConfirmedClient } from './confirmed-client'

export const metadata: Metadata = {
  title: 'Booking Confirmed — Voxa Studios',
  description: 'Your session is reserved. Our team will reach out 24 hours before.',
  robots: { index: false, follow: false },
}

export default function BookingConfirmedPage() {
  return <ConfirmedClient />
}
