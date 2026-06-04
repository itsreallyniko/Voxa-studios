import { Hero } from '@/components/marketing/hero'
import { CollectionsPreview } from '@/components/marketing/collections-preview'
import { ExampleContentSlider } from '@/components/marketing/example-content-slider'
import { WhyVoxa } from '@/components/marketing/why-voxa'
import { SocialProof } from '@/components/marketing/social-proof'
import { StudioTourCTA } from '@/components/marketing/studio-tour-cta'
import { BookSection } from '@/components/marketing/book-section'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'

export default function Home() {
  return (
    <>
      <Hero />
      <CollectionsPreview />
      <ExampleContentSlider />
      <WhyVoxa />
      <SocialProof />
      <StudioTourCTA />
      <BookSection />
      <FinalCTA />
      <Footer />
    </>
  )
}
