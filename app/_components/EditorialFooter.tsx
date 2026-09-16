const items = [
  { title: 'Visit our store', body: 'Kammanahalli, Bengaluru' },
  { title: 'Call us', body: '+91 99160 32291' },
  { title: 'Express delivery', body: 'Pan India' },
  { title: '100% authenticity', body: 'Premium Quality Guarantee' },
]

export function EditorialFooter() {
  return (
    <footer
      className="editorial grid grid-cols-2 lg:grid-cols-4 gap-6 px-[5vw] py-9"
      style={{ borderTop: '1px solid var(--editorial-line)', background: 'var(--editorial-cream)' }}
    >
      {items.map((item) => (
        <div key={item.title}>
          <b className="block text-[10px] uppercase tracking-[0.08em]">{item.title}</b>
          <span className="block mt-1.5 text-[11px]" style={{ color: '#71685d' }}>{item.body}</span>
        </div>
      ))}
    </footer>
  )
}
