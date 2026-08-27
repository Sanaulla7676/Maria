import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import OrdersTable from './OrdersTable'
import '../admin.css'

export type AdminOrder = {
  id: string
  total: number
  payment_status: string
  payment_reference: string | null
  status: string
  created_at: string
  notes: string | null
  profiles: { full_name: string | null; phone: string | null } | null
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) redirect('/')

  const { data, error } = await supabase
    .from('customer_orders')
    .select('id, total, payment_status, payment_reference, status, created_at, notes, profiles(full_name, phone)')
    .order('created_at', { ascending: false })

  const orders = (error ? [] : (data ?? [])) as unknown as AdminOrder[]

  return (
    <main className="container admin-page">
      <Link className="back-link" href="/admin"><ArrowLeft size={16} /> Admin dashboard</Link>
      <section className="admin-header">
        <div>
          <span className="kicker">Maria Operations</span>
          <h1>Orders &amp; payments</h1>
          <p>Live orders from Supabase. Verify UPI references and move fulfilment forward.</p>
        </div>
      </section>
      {error && <div className="error-note">{error.message}</div>}
      <OrdersTable initialOrders={orders} />
    </main>
  )
}
