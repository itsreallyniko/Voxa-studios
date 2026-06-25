import { Hero } from '@/components/marketing/hero'
import { BookSection } from '@/components/marketing/book-section'
import { CreationsMarquee } from '@/components/marketing/creations-marquee'
import { WhyVoxa } from '@/components/marketing/why-voxa'
import { WhatYouGet } from '@/components/marketing/what-you-get'
import { ComeVisitUs } from '@/components/marketing/come-visit-us'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <CreationsMarquee />
      <WhyVoxa />
      <WhatYouGet />
      <BookSection />
      <ComeVisitUs />
      <FinalCTA />
      <Footer />
    </>
  )
}
