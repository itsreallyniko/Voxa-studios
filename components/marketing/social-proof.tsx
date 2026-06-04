const TESTIMONIALS = [
  {
    name: 'DR. JULIAN VOSS',
    role: 'WELLNESS FOUNDER',
    quote:
      "The transition from my home office to Voxa changed how my audience perceives my brand. It's the highest production ROI I've ever found.",
  },
  {
    name: 'SARAH CHENG',
    role: 'STRATEGY CONSULTANT',
    quote:
      'I batch an entire month of YouTube videos and LinkedIn shorts in one 4-hour block. The team here makes it effortless.',
  },
  {
    name: 'MARCUS REED',
    role: 'PODCAST HOST',
    quote:
      'Unmatched aesthetic. The Executive Set is exactly what I needed for my business interviews. Truly a luxury experience.',
  },
]

export function SocialProof() {
  return (
    <section className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="text-center mb-24">
          <span className="text-label-caps text-heritage-gold mb-4 block">TRUSTED BY LEADERS</span>
          <h2 className="text-headline-xl text-white">
            Built For Professionals Creating <br /> Content Consistently
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="liquid-glass p-10 group hover:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-slate-gray" />
                <div>
                  <h5 className="text-label-caps text-white">{t.name}</h5>
                  <p className="text-[10px] text-heritage-gold tracking-[0.3em]">{t.role}</p>
                </div>
              </div>
              <p className="text-ivory/60 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
