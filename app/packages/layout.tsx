import { Footer } from '@/components/marketing/footer'

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* room for the builder's fixed mobile bar below the lg breakpoint */}
      <div className="pb-28 lg:pb-0">
        {children}
        <Footer />
      </div>
    </>
  )
}
