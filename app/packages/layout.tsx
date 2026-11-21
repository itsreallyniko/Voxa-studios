import { Footer } from '@/components/marketing/footer'

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
