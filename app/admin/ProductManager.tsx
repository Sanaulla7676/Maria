'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronUp, ImagePlus, Loader2, Search, Star, Trash2, Upload, Video } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/browser'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  family: string | null
  gender: string | null
  badge: string | null
  active: boolean
  featured: boolean
  product_images?: ImageRow[]
  product_variants?: Variant[]
}

type ImageRow = { id: string; image_url: string; alt_text: string | null; sort_order: number }
type MediaRow = { id: string; product_id: string; media_type: 'image' | 'video'; media_url: string; alt_text: string | null; sort_order: number; is_primary: boolean }
type Variant = { id: string; size_ml: number; price: number; stock: number; active: boolean; label: string }

const BUCKET = 'product-images'

export default function ProductManager() {
  const supabase = supabaseBrowser()
  const [products, setProducts] = useState<Product[]>([])
  const [media, setMedia] = useState<MediaRow[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = products.find((p) => p.id === selectedId) ?? products[0]
  const selectedMedia = useMemo(() => media.filter((m) => m.product_id === selected?.id).sort((a, b) => a.sort_order - b.sort_order), [media, selected?.id])
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.family ?? '').toLowerCase().includes(query.toLowerCase()))

  async function load() {
    setLoading(true)
    const [{ data: ps }, { data: ms }] = await Promise.all([
      supabase.from('products').select('id,name,slug,description,family,gender,badge,active,featured,product_images(*),product_variants(*)').order('name'),
      supabase.from('product_media').select('*').order('sort_order')
    ])
    setProducts((ps ?? []) as Product[])
    setMedia((ms ?? []) as MediaRow[])
    if (!selectedId && ps?.[0]) setSelectedId(ps[0].id)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateProduct(patch: Partial<Product>) {
    if (!selected) return
    setMessage('')
    const { data, error } = await supabase.from('products').update(patch).eq('id', selected.id).select('id,name,slug,description,family,gender,badge,active,featured').single()
    if (error) return setMessage(error.message)
    setProducts((all) => all.map((p) => p.id === selected.id ? { ...p, ...(data as Product) } : p))
    setMessage('Saved')
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || !selected) return
    setUploading(true); setMessage('')
    let position = selectedMedia.length
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) continue
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
      const path = `${selected.slug}/${crypto.randomUUID()}-${safe}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, cacheControl: '31536000', contentType: file.type })
      if (uploadError) { setMessage(uploadError.message); continue }
      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      if (file.type.startsWith('image/')) {
        await supabase.from('product_images').insert({ product_id: selected.id, image_url: publicData.publicUrl, alt_text: selected.name, sort_order: position++ })
      }
      await supabase.from('product_media').insert({ product_id: selected.id, media_type: file.type.startsWith('video/') ? 'video' : 'image', media_url: publicData.publicUrl, alt_text: selected.name, sort_order: position++ - 1, is_primary: selectedMedia.length === 0 })
    }
    await load()
    setMessage('Media uploaded')
    setUploading(false)
  }

  async function deleteMedia(item: MediaRow) {
    const marker = `/storage/v1/object/public/${BUCKET}/`
    const path = item.media_url.includes(marker) ? decodeURIComponent(item.media_url.split(marker)[1]) : ''
    if (path) await supabase.storage.from(BUCKET).remove([path])
    await supabase.from('product_media').delete().eq('id', item.id)
    if (item.media_type === 'image') await supabase.from('product_images').delete().eq('product_id', item.product_id).eq('image_url', item.media_url)
    await load()
  }

  async function makePrimary(item: MediaRow) {
    if (item.media_type !== 'image') return
    await supabase.from('product_media').update({ is_primary: false }).eq('product_id', item.product_id)
    await supabase.from('product_media').update({ is_primary: true }).eq('id', item.id)
    const { data: rows } = await supabase.from('product_media').select('*').eq('product_id', item.product_id).eq('media_type', 'image').order('sort_order')
    const imageRows = (rows ?? []) as MediaRow[]
    for (let i = 0; i < imageRows.length; i++) await supabase.from('product_images').update({ sort_order: i }).eq('product_id', item.product_id).eq('image_url', imageRows[i].media_url)
    await load(); setMessage('Primary image updated')
  }

  async function move(item: MediaRow, direction: -1 | 1) {
    const list = [...selectedMedia]
    const index = list.findIndex((m) => m.id === item.id)
    const target = index + direction
    if (index < 0 || target < 0 || target >= list.length) return
    const a = list[index], b = list[target]
    await Promise.all([
      supabase.from('product_media').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('product_media').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    await load()
  }

  if (loading) return <div className="admin-card" style={{ padding: 32 }}><Loader2 className="spin" size={22} /> Loading catalogue…</div>

  return (
    <div className="product-manager">
      <div className="pm-toolbar">
        <div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" /></div>
        <button className="button" onClick={() => inputRef.current?.click()} disabled={!selected || uploading}><Upload size={16} /> {uploading ? 'Uploading…' : 'Upload media'}</button>
        <input ref={inputRef} hidden type="file" accept="image/*,video/*" multiple onChange={(e) => { uploadFiles(e.target.files); e.currentTarget.value = '' }} />
      </div>

      {message && <div className="pm-message">{message}</div>}

      <div className="pm-layout">
        <aside className="admin-card pm-products">
          <div className="pm-heading"><div><span className="kicker">Catalogue</span><h2>{products.length} products</h2></div></div>
          <div className="pm-product-list">{filtered.map((p) => {
            const count = media.filter((m) => m.product_id === p.id).length
            return <button key={p.id} onClick={() => setSelectedId(p.id)} className={`pm-product ${p.id === selected?.id ? 'selected' : ''}`}><span><strong>{p.name}</strong><small>{p.family ?? 'Signature'} · {count} media</small></span>{p.featured && <Star size={15} fill="currentColor" />}</button>
          })}</div>
        </aside>

        {selected && <section className="admin-card pm-editor">
          <div className="pm-editor-head"><div><span className="kicker">Product controls</span><h2>{selected.name}</h2><p>Media, merchandising, visibility and inventory controls.</p></div><a className="button" href={`/product/${selected.slug}`} target="_blank">Preview</a></div>

          <div className="pm-controls">
            <label><span>Collection / family</span><input value={selected.family ?? ''} onChange={(e) => setProducts((all) => all.map((p) => p.id === selected.id ? { ...p, family: e.target.value } : p))} onBlur={() => updateProduct({ family: selected.family })} /></label>
            <label><span>Badge</span><input value={selected.badge ?? ''} onChange={(e) => setProducts((all) => all.map((p) => p.id === selected.id ? { ...p, badge: e.target.value } : p))} onBlur={() => updateProduct({ badge: selected.badge })} placeholder="Bestseller, New…" /></label>
            <label className="wide"><span>Description</span><textarea value={selected.description ?? ''} onChange={(e) => setProducts((all) => all.map((p) => p.id === selected.id ? { ...p, description: e.target.value } : p))} onBlur={() => updateProduct({ description: selected.description })} rows={3} /></label>
            <label className="switch"><input type="checkbox" checked={selected.active} onChange={(e) => updateProduct({ active: e.target.checked })} /><span>Published on storefront</span></label>
            <label className="switch"><input type="checkbox" checked={selected.featured} onChange={(e) => updateProduct({ featured: e.target.checked })} /><span>Featured product</span></label>
          </div>

          <div className="pm-section-head"><div><span className="kicker">Media library</span><h3>{selectedMedia.length} assets</h3></div><button className="icon-button" onClick={() => inputRef.current?.click()}><ImagePlus size={18} /></button></div>
          <div className="pm-media-grid">
            {selectedMedia.map((item, index) => <article className={`pm-media ${item.is_primary ? 'primary' : ''}`} key={item.id}>
              <div className="pm-media-preview">{item.media_type === 'video' ? <><video src={item.media_url} controls preload="metadata" /><span className="media-type"><Video size={13} /> Video</span></> : <><img src={item.media_url} alt={item.alt_text ?? selected.name} /><span className="media-type"><ImagePlus size={13} /> Image</span></>}</div>
              <div className="pm-media-body"><strong>{item.is_primary ? 'Primary image' : item.media_type === 'video' ? 'Product video' : `Gallery image ${index + 1}`}</strong><small>{item.alt_text || selected.name}</small></div>
              <div className="pm-media-actions"><button disabled={index === 0} onClick={() => move(item, -1)} title="Move up"><ChevronUp size={15} /></button><button disabled={index === selectedMedia.length - 1} onClick={() => move(item, 1)} title="Move down"><ChevronDown size={15} /></button>{item.media_type === 'image' && <button className={item.is_primary ? 'active' : ''} onClick={() => makePrimary(item)} title="Set primary"><Star size={15} fill={item.is_primary ? 'currentColor' : 'none'} /></button>}<button className="danger" onClick={() => deleteMedia(item)} title="Delete"><Trash2 size={15} /></button></div>
            </article>)}
            {!selectedMedia.length && <button className="pm-dropzone" onClick={() => inputRef.current?.click()}><ImagePlus size={28} /><strong>Upload product photos or videos</strong><span>Multiple files supported · stored in Supabase Storage</span></button>}
          </div>

          <div className="pm-variants"><div className="pm-section-head"><div><span className="kicker">Variants & inventory</span><h3>30 / 50 / 100 ml</h3></div></div><div className="pm-variant-grid">{(selected.product_variants ?? []).sort((a,b) => a.size_ml-b.size_ml).map((v) => <VariantEditor key={v.id} variant={v} supabase={supabase} onSaved={load} />)}</div></div>
        </section>}
      </div>
    </div>
  )
}

function VariantEditor({ variant, supabase, onSaved }: { variant: Variant; supabase: ReturnType<typeof supabaseBrowser>; onSaved: () => void }) {
  const [price, setPrice] = useState(String(variant.price))
  const [stock, setStock] = useState(String(variant.stock))
  const [active, setActive] = useState(variant.active)
  const [saving, setSaving] = useState(false)
  async function save() { setSaving(true); await supabase.from('product_variants').update({ price: Number(price), stock: Math.max(0, Number(stock)), active }).eq('id', variant.id); setSaving(false); onSaved() }
  return <div className="pm-variant"><strong>{variant.size_ml}ml</strong><label>Price<input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></label><label>Stock<input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} /></label><label className="mini-switch"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active</label><button className="button small" onClick={save} disabled={saving}>{saving ? <Loader2 size={14} /> : <Check size={14} />} Save</button></div>
}
