import Link from 'next/link'
import { ArrowUpRight, BarChart3, Package, ShoppingBag, Users } from 'lucide-react'

const kpis = [
  { label: 'Revenue', value: '₹0', delta: 'No paid orders yet', icon: BarChart3 },
  { label: 'Orders', value: '0', delta: 'All-time orders', icon: ShoppingBag },
  { label: 'Customers', value: '0', delta: 'Registered customers', icon: Users },
  { label: 'Low stock', value: '0', delta: 'Variants needing attention', icon: Package },
]

export default function AnalyticsPage() {
  return <main className="container admin-page">
    <Link className="back-link" href="/admin">← Admin dashboard</Link>
    <section className="admin-header"><div><span className="kicker">Business intelligence</span><h1>Maria analytics.</h1><p>One view for sales, customers, orders and stock performance.</p></div><Link className="button" href="/admin/orders">View orders <ArrowUpRight size={15}/></Link></section>
    <section className="kpi-grid">{kpis.map(({label,value,delta,icon:Icon})=><article className="kpi-card" key={label}><Icon size={20}/><span>{label}</span><strong>{value}</strong><small>{delta}</small></article>)}</section>
    <section className="analytics-panels"><article><span className="kicker">Revenue trend</span><h2>Sales performance</h2><div className="chart-placeholder">Live revenue chart connects to verified orders.</div></article><article><span className="kicker">Top products</span><h2>Best sellers</h2><div className="chart-placeholder">Top-selling variants will appear here.</div></article></section>
  </main>
}
