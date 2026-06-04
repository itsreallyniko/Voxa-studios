const FEATURES = [
  { icon: 'videocam', label: 'MULTI-CAMERA RECORDING', desc: 'Professional coverage without the setup.' },
  { icon: 'light_mode', label: 'PROFESSIONAL LIGHTING', desc: 'Optimized lighting designed to help you look your best on camera.' },
  { icon: 'mic', label: 'STUDIO AUDIO', desc: 'Broadcast quality sound treatment.' },
  { icon: 'notes', label: 'TELEPROMPTER', desc: 'Available on all sets for seamless delivery.' },
  { icon: 'auto_awesome', label: 'TURNKEY EXPERIENCE', desc: 'Show up, record, and leave with professionally captured content.' },
  { icon: 'bolt', label: 'MULTIPLE SET OPTIONS', desc: 'Choose the look that fits your brand.' },
  { icon: 'support_agent', label: 'PRODUCER SUPPORT', desc: 'On-site help with tech and direction.' },
]

export function WhyVoxa() {
  return (
    <section id="why" className="py-section-gap bg-obsidian">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge">
        <div className="max-w-3xl mb-24">
          <span className="text-label-caps text-heritage-gold mb-4 block">THE EXPERIENCE</span>
          <h2 className="text-headline-xl text-white">Everything Is Already Ready</h2>
          <p className="text-body-lg text-ivory/60 mt-6">
            Forget the technical overhead. Our studios are engineered for immediate performance.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {FEATURES.map((f) => (
            <div key={f.label} className="p-10 bg-obsidian group hover:bg-white/[0.02] transition-colors">
              <span className="material-symbols-outlined text-heritage-gold text-3xl mb-6">{f.icon}</span>
              <h4 className="text-label-caps text-white mb-3">{f.label}</h4>
              <p className="text-sm text-ivory/40">{f.desc}</p>
            </div>
          ))}
          <div className="p-10 bg-obsidian group hover:bg-white/[0.02] transition-colors flex items-center justify-center">
            <a
              href="/book"
              className="text-[10px] text-heritage-gold border-b border-heritage-gold pb-1 hover:text-white hover:border-white transition-all tracking-[0.4em]"
            >
              VIEW ALL FEATURES
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
