const reviews = [
  {
    name: 'Rahul Sharma',
    tag: 'Verified Buyer • Google Review',
    quote:
      '"Unbelievable quality! Their signature Oud lasts more than 12 hours easily. Why spend thousands on designer brands when Maria Perfumes gives the same projection at a fraction of the price?"',
  },
  {
    name: 'Priya & Vikram',
    tag: 'Wedding Hosts • Event Stall',
    quote:
      '"We booked Maria Perfumes\' live fragrance stall for our wedding reception. All our guests were thrilled to receive personalized custom perfume favors. Best event stall idea ever!"',
  },
  {
    name: 'Syed Ibrahim',
    tag: 'Regular Attar Collector',
    quote:
      '"The pure attars and signature perfumes are phenomenal. Concentrated, alcohol-free oil that stays on garments for days. 10/10 value for money!"',
  },
]

export function SuccessStories() {
  return (
    <section id="success-stories" className="bg-slate-100 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-champagne-600 font-semibold text-xs uppercase tracking-[0.2em]">
            Google Reviews • 4.7 Stars
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wine-950">
            Loved By Fragrance Lovers in Bengaluru
          </h2>
          <p className="text-xs text-slate-600 font-light">
            Real feedback from 79+ happy store customers &amp; event hosts praising our longevity and stall
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-wine-50 ring-2 ring-champagne-400 flex items-center justify-center font-serif font-bold text-wine-900">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900">{r.name}</h4>
                  <p className="text-[10px] text-slate-400">{r.tag}</p>
                </div>
              </div>
              <p className="text-slate-600 font-light leading-relaxed italic">{r.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
