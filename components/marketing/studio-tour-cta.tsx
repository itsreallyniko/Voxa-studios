import { Button } from '@/components/ui/button'

const BG_IMAGE =
  'https://lh3.googleusercontent.com/aida/ADBb0ujOG5lOECLnhvFgTXRviMraX_PmwQ-wbztKdNrbLdhexTRjSvDVJ0GSNReX3GGiQkyKZTsDy6XofPCpnqTdrCrddPnSy1L-nlwXlHg2ioy91AWyRB_3pOYnT-JL8QRTV3UbRB4nyv4MweKnKrqqHMDpFDtxiU4vs_eWckBWuvpt9rW49nZOy2FDYKDzjGMMwXa5kf8TXb5l2dCJSSsEo1gPJXjcrk1yd-eaKX9bZRKVB4bxvV5JylTyHigb'

export function StudioTourCTA() {
  return (
    <section className="py-section-gap bg-surface-container-low relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="w-full h-full object-cover" src={BG_IMAGE} />
      </div>
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <h2 className="text-headline-xl text-white mb-6">Want To See The Studio First?</h2>
          <p className="text-body-lg text-ivory/60">
            Schedule a quick studio tour and see every set in person before booking. No pressure, just a walk-through
            of the possibilities.
          </p>
        </div>
        <Button variant="primary" size="lg" className="shrink-0">
          Book A Studio Tour
        </Button>
      </div>
    </section>
  )
}
