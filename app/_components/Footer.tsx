export function Footer() {
  return (
    <footer className="bg-wine-950 text-slate-300 text-xs py-16 border-t border-champagne-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-serif font-bold text-lg text-white mb-4">Maria Perfumes</h5>
            <p className="text-slate-400 font-light leading-relaxed">
              Premier fragrance store &amp; live event return gift stall providers in Bengaluru. Specializing in
              luxury perfumes, pure attars, and custom event scent bars.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase tracking-wider text-[11px] text-champagne-400">Quick Links</h5>
            <ul className="space-y-2.5 font-light">
              <li><a href="#about-section" className="hover:text-white transition">About Store</a></li>
              <li><a href="#event-stalls-section" className="hover:text-white transition">Live Event Stalls</a></li>
              <li><a href="#matches-section" className="hover:text-white transition">Fragrance Catalog</a></li>
              <li><a href="#success-stories" className="hover:text-white transition">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase tracking-wider text-[11px] text-champagne-400">Google Business</h5>
            <ul className="space-y-2.5 font-light">
              <li>
                <a href="https://maps.google.com/?q=Maria+Perfumes+Kammanahalli+Bengaluru" target="_blank" rel="noreferrer" className="hover:text-white transition">
                  Google Store Profile
                </a>
              </li>
              <li>4.7 Stars (79 Google Reviews)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 uppercase tracking-wider text-[11px] text-champagne-400">Store Contact</h5>
            <p className="text-slate-400 font-light leading-relaxed">
              Shop No. 55, 1st Floor, 2nd Cross Main Road, Indra Nagar, Ramaiah Layout, Kammanahalli, Bengaluru, KA
              560084 (Near Big Chicken Restaurant)
              <br />
              Phone: +91 99160 32291
            </p>
          </div>
        </div>
        <div className="text-center text-slate-500 border-t border-white/5 pt-8 font-light">
          <p>&copy; {new Date().getFullYear()} Maria Perfumes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
