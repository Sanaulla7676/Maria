export function AboutCredentials() {
  return (
    <section id="about-section" className="wine-gradient text-white py-20 relative overflow-hidden border-b border-champagne-500/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-champagne-400 font-semibold text-xs tracking-[0.2em] uppercase block">
              Our Fragrance Legacy • Est. 2025
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white leading-tight">
              Premium Scents &amp; Live Event Fragrance Bars
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              <strong className="text-champagne-400 font-normal">Maria Perfumes</strong> is a premier, budget-friendly
              fragrance brand located in Kammanahalli, Bengaluru. Established in 2025, we specialize in luxury
              fragrances, designer-inspired perfumes, pure attars, and custom{' '}
              <strong className="text-white">Live Fragrance Stalls &amp; Return Gift Counters</strong> for weddings,
              birthday parties, anniversaries, and corporate celebrations.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-champagne-400">4.7 ★</h3>
                <p className="text-xs text-slate-400 font-light mt-1">79 Google Reviews</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-champagne-400">100+</h3>
                <p className="text-xs text-slate-400 font-light mt-1">Event Stalls Delivered</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-champagne-400">40%</h3>
                <p className="text-xs text-slate-400 font-light mt-1">Pure Oil Concentration</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white text-slate-800 p-8 rounded-3xl shadow-2xl border border-champagne-400/40 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-wine-950">Google Business Profile</h3>
                  <p className="text-xs text-slate-500">Official Boutique &amp; Event Services</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium text-slate-600">
                <div className="flex items-start gap-3">
                  <div>
                    <span className="text-slate-900 font-semibold block">Store Address:</span>
                    <span>
                      Shop No. 55, 1st Floor, 2nd Cross Main Road, Indra Nagar, Ramaiah Layout, Kammanahalli,
                      Bengaluru, KA 560084 (Near Big Chicken Restaurant)
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <span className="text-slate-900 font-semibold block">Direct Phone / Event Booking:</span>
                    <span>+91 99160 32291</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <span className="text-slate-900 font-semibold block">Services Offered:</span>
                    <span className="text-emerald-700">
                      Live Event Fragrance Stalls • Custom Return Gifts • Store Shopping • Express Delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <a
                  href="tel:+919916032291"
                  className="bg-wine-900 hover:bg-wine-950 text-white font-semibold text-xs py-3 rounded-xl text-center transition"
                >
                  Call Store
                </a>
                <a
                  href="https://maps.google.com/?q=Maria+Perfumes+Kammanahalli+Bengaluru"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-slate-300 hover:border-champagne-500 text-slate-800 font-semibold text-xs py-3 rounded-xl text-center transition"
                >
                  Map Route
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
