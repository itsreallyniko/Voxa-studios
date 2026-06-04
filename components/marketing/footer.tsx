export function Footer() {
  return (
    <footer className="py-20 bg-obsidian border-t border-white/5">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-edge flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="text-2xl text-white">VOXA</span>
          <p className="text-ivory/30 text-xs tracking-widest">LUXURY CONTENT ENVIRONMENTS</p>
        </div>
        <div className="flex gap-12">
          <a href="#" className="text-label-caps text-ivory/40 hover:text-white transition-colors">INSTAGRAM</a>
          <a href="#" className="text-label-caps text-ivory/40 hover:text-white transition-colors">TWITTER</a>
          <a href="#" className="text-label-caps text-ivory/40 hover:text-white transition-colors">LINKEDIN</a>
        </div>
        <div className="text-[10px] text-ivory/20 tracking-[0.4em]">© 2026 VOXA STUDIOS. ALL RIGHTS RESERVED.</div>
      </div>
    </footer>
  )
}
