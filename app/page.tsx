import { Hero } from '@/components/marketing/hero'
import { BookSection } from '@/components/marketing/book-section'
import { ExampleContentSlider } from '@/components/marketing/example-content-slider'
import { WhyVoxa } from '@/components/marketing/why-voxa'
import { SocialProof } from '@/components/marketing/social-proof'
import { StudioTourCTA } from '@/components/marketing/studio-tour-cta'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <BookSection />
      <ExampleContentSlider />
      <WhyVoxa />
      <SocialProof />
      <StudioTourCTA />
      <FinalCTA />
      <Footer />
    </>
  )
}
