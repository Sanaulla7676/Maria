'use client'

import { Search } from 'lucide-react'

export type Filters = {
  family: string
  minPrice: number
  gender: string
  query: string
}

export function FilterBar({
  filters,
  setFilters,
  families,
  genders,
}: {
  filters: Filters
  setFilters: (f: Filters) => void
  families: string[]
  genders: string[]
}) {
  return (
    <section className="bg-wine-950 py-8 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-slate-800">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-champagne-400 mb-1.5 tracking-wider">
              Fragrance Family
            </label>
            <select
              value={filters.family}
              onChange={(e) => setFilters({ ...filters, family: e.target.value })}
              className="w-full bg-white text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-champagne-500 border-none font-medium"
            >
              <option value="all">All Fragrances</option>
              {families.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-champagne-400 mb-1.5 tracking-wider">
              Price Filter
            </label>
            <select
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              className="w-full bg-white text-xs rounded-xl p-3 focus:outline-none"
            >
              <option value={0}>All Prices</option>
              <option value={600}>₹600 &amp; above</option>
              <option value={1000}>₹1,000 &amp; above</option>
              <option value={1500}>₹1,500 &amp; above</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-champagne-400 mb-1.5 tracking-wider">
              Ideal For
            </label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="w-full bg-white text-xs rounded-xl p-3 focus:outline-none"
            >
              <option value="all">Unisex / Men / Women</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 md:col-span-2">
            <label className="block text-[10px] uppercase font-semibold text-champagne-400 mb-1.5 tracking-wider">
              Search Notes or Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="e.g. Oud, Vanilla, Leather..."
                className="w-full bg-white text-xs rounded-xl p-3 pl-9 focus:outline-none focus:ring-2 focus:ring-champagne-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
