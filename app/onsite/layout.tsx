import { Footer } from '@/components/marketing/footer'

export default function OnsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer showOnsiteLink />
    </>
  )
}
