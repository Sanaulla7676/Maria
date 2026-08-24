'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function NewQuotationPage(){
 const [items,setItems]=useState([{description:'Return gift perfume',qty:100,unit:0}])
 const total=useMemo(()=>items.reduce((s,i)=>s+i.qty*i.unit,0),[items])
 return <main className="container admin-page"><Link className="back-link" href="/admin/quotations"><ArrowLeft size={16}/> Quotations</Link><section className="admin-header"><div><span className="kicker">New quotation</span><h1>Build a quote.</h1><p>Draft an event or return-gift quotation before sending it to the client.</p></div></section><section className="quote-editor"><label>Client / company<input placeholder="Client name"/></label><label>Event type<select defaultValue="Return Gifts"><option>Return Gifts</option><option>Private Workshop</option><option>Corporate Workshop</option><option>Event Stall</option></select></label><div className="quote-lines"><div className="quote-line quote-head"><span>Description</span><span>Qty</span><span>Unit price</span><span>Total</span><span/></div>{items.map((item,index)=><div className="quote-line" key={index}><input value={item.description} onChange={e=>setItems(v=>v.map((x,i)=>i===index?{...x,description:e.target.value}:x))}/><input type="number" min="1" value={item.qty} onChange={e=>setItems(v=>v.map((x,i)=>i===index?{...x,qty:Number(e.target.value)}:x))}/><input type="number" min="0" value={item.unit} onChange={e=>setItems(v=>v.map((x,i)=>i===index?{...x,unit:Number(e.target.value)}:x))}/><strong>₹{(item.qty*item.unit).toLocaleString('en-IN')}</strong><button onClick={()=>setItems(v=>v.filter((_,i)=>i!==index))}><Trash2 size={15}/></button></div>)}<button className="button" onClick={()=>setItems(v=>[...v,{description:'New line item',qty:1,unit:0}])}><Plus size={15}/> Add line</button></div><div className="quote-total"><span>Estimated total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><button className="button primary">Save quotation draft</button></section></main>
}
