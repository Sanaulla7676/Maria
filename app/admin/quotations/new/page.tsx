'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Share2, Printer } from 'lucide-react'
import { useMemo, useState } from 'react'
import '../../admin.css'
import { calculateQuotationTotal } from '@/lib/quotation'

export default function NewQuotationPage(){
 const [items,setItems]=useState([{description:'Return gift perfume set',quantity:100,unit_price:600}])
 const total=useMemo(()=>calculateQuotationTotal(items),[items])
 const addItem=()=>setItems(v=>[...v,{description:'',quantity:1,unit_price:0}])
 return <main className="container admin-page">
  <Link className="back-link" href="/admin/quotations"><ArrowLeft size={16}/> Quotations</Link>
  <section className="admin-header"><div><span className="kicker">Quotation builder</span><h1>New quotation.</h1><p>Create a polished quote for an event, workshop or return-gift requirement.</p></div></section>
  <form action="/api/admin/quotations" method="post" className="quote-editor">
   <label>Client / company<input name="customer_name" required placeholder="Client name"/></label>
   <label>Phone<input name="customer_phone" required placeholder="WhatsApp / phone"/></label>
   <label>Email<input name="customer_email" type="email" placeholder="email@example.com"/></label>
   <label>Event type<select name="event_type" defaultValue="Return Gifts"><option>Return Gifts</option><option>Private Workshop</option><option>Corporate Workshop</option><option>Event Stall</option></select></label>
   <label>Valid until<input name="valid_until" type="date" required defaultValue={new Date(Date.now()+7*86400000).toISOString().slice(0,10)}/></label>
   <label>Notes<textarea name="notes" rows={3} placeholder="Packaging, delivery or event notes"/></label>
   <div className="quote-lines"><div className="quote-line quote-head"><span>Description</span><span>Qty</span><span>Unit</span><span>Total</span><span/></div>
    {items.map((item,index)=><div className="quote-line" key={index}><input value={item.description} onChange={e=>setItems(v=>v.map((x,i)=>i===index?{...x,description:e.target.value}:x))}/><input type="number" min="1" value={item.quantity} onChange={e=>setItems(v=>v.map((x,i)=>i===index?{...x,quantity:Number(e.target.value)}:x))}/><input type="number" min="0" value={item.unit_price} onChange={e=>setItems(v=>v.map((x,i)=>i===index?{...x,unit_price:Number(e.target.value)}:x))}/><strong>₹{(item.quantity*item.unit_price).toLocaleString('en-IN')}</strong><button type="button" onClick={()=>setItems(v=>v.filter((_,i)=>i!==index))}><Trash2 size={15}/></button></div>)}
    <button type="button" className="button" onClick={addItem}><Plus size={15}/> Add line</button>
   </div>
   <div className="quote-total"><span>Quotation total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
   <input type="hidden" name="items" value={JSON.stringify(items)}/>
   <div className="hero-actions"><button className="button primary" type="submit"><Save size={16}/> Save quotation</button><button className="button" type="button" onClick={()=>window.print()}><Printer size={16}/> Print / Save PDF</button><button className="button" type="button" onClick={()=>{const phone=(document.querySelector('[name=customer_phone]') as HTMLInputElement)?.value||'';window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Maria quotation draft: ₹${total.toLocaleString('en-IN')}`)}`,'_blank')}}><Share2 size={16}/> WhatsApp</button></div>
  </form>
 </main>
}
