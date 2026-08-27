export function TrustStrip() {
  return (
    <div className="bg-wine-950 text-slate-300 text-[10px] h-7 px-4 sm:px-8 border-b border-champagne-500/15 relative z-50 flex items-center justify-between tracking-wider uppercase font-medium">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center space-x-5">
          <span className="flex items-center gap-1.5">
            <strong className="text-white font-bold">4.7</strong>
            <span className="text-champagne-400 tracking-tighter">★★★★★</span>
            <span className="text-slate-400 font-light lowercase tracking-normal">(79 Google Reviews)</span>
          </span>
        </div>
        <div className="flex items-center space-x-5">
          <span className="hidden sm:inline-block text-slate-300 font-light lowercase tracking-normal">
            Daily 10:00 AM – 9:30 PM IST
          </span>
          <a
            href="https://maps.google.com/?q=Maria+Perfumes+Kammanahalli+Bengaluru"
            target="_blank"
            rel="noreferrer"
            className="text-champagne-300 hover:text-white transition flex items-center gap-1 font-semibold"
          >
            Kammanahalli, Bengaluru
          </a>
        </div>
      </div>
    </div>
  )
}
