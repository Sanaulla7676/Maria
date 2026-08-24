'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Package, Truck, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id,setId]=useState(''); const [order,setOrder]=useState<any>(null); const [carrier,setCarrier]=useState(''); const [tracking,setTracking]=useState(''); const [url,setUrl]=useState(''); const [busy,setBusy]=useState(false); const [message,setMessage]=useState('')
  const supabase=supabaseBrowser()
  useEffect(()=>{params.then(p=>setId(p.id))},[params])
  useEffect(()=>{if(!id)return; (async()=>{const {data,error}=await supabase.rpc('admin_get_order',{p_order_id:id}); if(error){setMessage(error.message);return} setOrder(data?.[0]??data); setCarrier(data?.[0]?.carrier??''); setTracking(data?.[0]?.tracking_number??''); setUrl(data?.[0]?.tracking_url??'')})()},[id])
  async function saveShipping(){setBusy(true);setMessage('');const {error}=await supabase.rpc('admin_update_shipping',{p_order_id:id,p_carrier:carrier,p_tracking_number:tracking,p_tracking_url:url||null});if(error)setMessage(error.message);else{setMessage('Tracking saved.');setOrder((o:any)=>({...o,status:'Shipped',carrier,tracking_number:tracking,tracking_url:url}))}setBusy(false)}
  if(!id)return null
  return <main className="container admin-page"><Link className="back-link" href="/admin/orders"><ArrowLeft size={16}/> Orders</Link><section className="admin-header"><div><span className="kicker">Order workspace</span><h1>{order?.order_code??id}</h1><p>Live order and fulfilment controls.</p></div><span className="status success"><CheckCircle2 size={15}/> {order?.payment_status??'Loading'}</span></section><section className="detail-grid"><article className="detail-card"><span className="kicker">Customer</span><h2>{order?.customer_name??'—'}</h2><p>{order?.shipping_address?.city??''}</p></article><article className="detail-card"><span className="kicker">Order value</span><h2>₹{Number(order?.total??0).toLocaleString('en-IN')}</h2><p>Status: {order?.status??'—'}</p></article><article className="detail-card"><span className="kicker">Payment</span><h2>{order?.payment_status??'—'}</h2><p>UTR: {order?.payment_reference??'—'}</p></article></section><section className="fulfilment-panel"><div><span className="kicker">Fulfilment</span><h2>Shipping & tracking</h2></div><div className="form-grid"><label>Carrier<input value={carrier} onChange={e=>setCarrier(e.target.value)} placeholder="e.g. Delhivery"/></label><label>Tracking number<input value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="Tracking ID"/></label><label className="wide">Tracking URL<input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/></label></div><div className="hero-actions"><button className="button primary" onClick={saveShipping} disabled={busy}>{busy?<Loader2 className="spin" size={16}/>:<Truck size={16}/>} {busy?'Saving...':'Save tracking & mark shipped'}</button>{message&&<span>{message}</span>}</div></section></main>
}
