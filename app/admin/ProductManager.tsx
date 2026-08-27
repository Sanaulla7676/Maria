'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronUp, ImagePlus, Loader2, Plus, Search, Star, Trash2, Upload, Video } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/browser'

type MainAccord = { name: string; color: string; percent: number }

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
  notes: string[] | null
  main_accords: MainAccord[] | null
  longevity_hours: number | null
  sillage: string | null
  best_daytime: string | null
  best_season: string[] | null
  product_images?: ImageRow[]
  product_variants?: Variant[]
}

const seasonOptions = ['Winter', 'Spring', 'Summer', 'Autumn']

type ImageRow = { id: string; image_url: string; alt_text: string | null; sort_order: number }
type MediaRow = { id: string; product_id: string; media_type: 'image' | 'video'; media_url: string; alt_text: string | null; sort_order: number; is_primary: boolean }
type Variant = { id: string; size_ml: number | null; price: number; stock: number; active: boolean; label: string; sku: string | null; image_url: string | null }

const BUCKET = 'product-images'

export default function ProductManager({ initialProductId }: { initialProductId?: string }) {
  const supabase = supabaseBrowser()
  const [products, setProducts] = useState<Product[]>([])
  const [media, setMedia] = useState<MediaRow[]>([])
  const [selectedId, setSelectedId] = useState(initialProductId ?? '')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [accordName, setAccordName] = useState('')
  const [accordColor, setAccordColor] = useState('#6b1d2f')
  const [accordPercent, setAccordPercent] = useState(80)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = products.find((p) => p.id === selectedId) ?? products[0]
  const selectedMedia = useMemo(() => media.filter((m) => m.product_id === selected?.id).sort((a, b) => a.sort_order - b.sort_order), [media, selected?.id])
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || (p.family ?? '').toLowerCase().includes(query.toLowerCase()))

  async function load() {
    setLoading(true)
    const [{ data: ps }, { data: ms }] = await Promise.all([
      supabase.from('products').select('id,name,slug,description,family,gender,badge,active,featured,notes,main_accords,longevity_hours,sillage,best_daytime,best_season,product_images(*),product_variants(*)').order('name'),
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

  async function addNote() {
    const value = noteInput.trim()
    if (!value || !selected) return
    const nextNotes = [...(selected.notes ?? []), value]
    setNoteInput('')
    await updateProduct({ notes: nextNotes })
  }

  async function removeNote(note: string) {
    if (!selected) return
    const nextNotes = (selected.notes ?? []).filter((n) => n !== note)
    await updateProduct({ notes: nextNotes })
  }

  async function addAccord() {
    const value = accordName.trim()
    if (!value || !selected) return
    const next: MainAccord[] = [...(selected.main_accords ?? []), { name: value, color: accordColor, percent: accordPercent }]
    setAccordName('')
    await updateProduct({ main_accords: next })
  }

  async function removeAccord(name: string) {
    if (!selected) return
    const next = (selected.main_accords ?? []).filter((a) => a.name !== name)
    await updateProduct({ main_accords: next })
  }

  async function addVariant() {
    if (!selected) return
    const count = (selected.product_variants ?? []).length
    const { error } = await supabase.from('product_variants').insert({
      product_id: selected.id,
      label: `New Variant ${count + 1}`,
      sku: `${selected.slug}-${count + 1}`.toUpperCase(),
      price: 0,
      stock: 0,
      active: false,
    })
    if (error) return setMessage(error.message)
    await load()
  }

  async function deleteVariant(variantId: string) {
    await supabase.from('product_variants').delete().eq('id', variantId)
    await load()
  }

  async function toggleSeason(season: string) {
    if (!selected) return
    const current = selected.best_season ?? []
    const next = current.includes(season) ? current.filter((s) => s !== season) : [...current, season]
    await updateProduct({ best_season: next })
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

          <div className="pm-section-head"><div><span className="kicker">Fragrance notes</span><h3>{(selected.notes ?? []).length} notes</h3></div></div>
          <div className="pm-notes">
            {(selected.notes ?? []).map((note) => (
              <span key={note} className="pm-note-chip">
                {note}
                <button type="button" onClick={() => removeNote(note)} aria-label={`Remove ${note}`}>&times;</button>
              </span>
            ))}
            <form
              className="pm-note-add"
              onSubmit={(e) => { e.preventDefault(); addNote() }}
            >
              <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Add a note (e.g. Sandalwood)" />
              <button type="submit"><Plus size={13} /> Add</button>
            </form>
          </div>

          <div className="pm-section-head"><div><span className="kicker">Fragrance profile</span><h3>Detail page attributes</h3></div></div>
          <div className="pm-controls">
            <label><span>Longevity (hours)</span><input type="number" min="0" step="0.5" value={selected.longevity_hours ?? ''} onChange={(e) => setProducts((all) => all.map((p) => p.id === selected.id ? { ...p, longevity_hours: e.target.value ? Number(e.target.value) : null } : p))} onBlur={() => updateProduct({ longevity_hours: selected.longevity_hours })} /></label>
            <label><span>Sillage</span><select value={selected.sillage ?? ''} onChange={(e) => updateProduct({ sillage: e.target.value || null })}><option value="">Not set</option><option>Light</option><option>Moderate</option><option>Strong</option><option>Very Strong</option></select></label>
            <label><span>Best worn</span><select value={selected.best_daytime ?? ''} onChange={(e) => updateProduct({ best_daytime: e.target.value || null })}><option value="">Not set</option><option value="day">Day</option><option value="night">Night</option><option value="both">Both</option></select></label>
          </div>

          <div className="pm-notes" style={{ marginBottom: 12 }}>
            {seasonOptions.map((season) => (
              <button
                key={season}
                type="button"
                onClick={() => toggleSeason(season)}
                className="pm-note-chip"
                style={(selected.best_season ?? []).includes(season) ? { background: 'var(--wine)', color: 'white' } : undefined}
              >
                {season}
              </button>
            ))}
          </div>

          <div className="pm-notes">
            {(selected.main_accords ?? []).map((accord) => (
              <span key={accord.name} className="pm-note-chip" style={{ background: accord.color, color: 'white' }}>
                {accord.name} · {accord.percent}%
                <button type="button" onClick={() => removeAccord(accord.name)} aria-label={`Remove ${accord.name}`}>&times;</button>
              </span>
            ))}
            <form className="pm-note-add" onSubmit={(e) => { e.preventDefault(); addAccord() }}>
              <input value={accordName} onChange={(e) => setAccordName(e.target.value)} placeholder="Accord (e.g. Woody)" style={{ maxWidth: 140 }} />
              <input type="color" value={accordColor} onChange={(e) => setAccordColor(e.target.value)} style={{ width: 36, padding: 2 }} />
              <input type="number" min="1" max="100" value={accordPercent} onChange={(e) => setAccordPercent(Number(e.target.value))} style={{ width: 60 }} />
              <button type="submit"><Plus size={13} /> Add</button>
            </form>
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

          <div className="pm-variants">
            <div className="pm-section-head"><div><span className="kicker">Variants & inventory</span><h3>{(selected.product_variants ?? []).length} variant{(selected.product_variants ?? []).length === 1 ? '' : 's'} · unlimited</h3></div><button className="button small" onClick={addVariant}><Plus size={14} /> Add variant</button></div>
            <div className="pm-variant-grid">
              {(selected.product_variants ?? []).sort((a, b) => (a.size_ml ?? 0) - (b.size_ml ?? 0)).map((v) => (
                <VariantEditor key={v.id} variant={v} supabase={supabase} productSlug={selected.slug} onSaved={load} onDeleted={() => deleteVariant(v.id)} />
              ))}
              {!(selected.product_variants ?? []).length && (
                <button className="pm-dropzone" onClick={addVariant}><Plus size={28} /><strong>Add your first variant</strong><span>Size, flavor, edition — anything with its own price, stock &amp; photo</span></button>
              )}
            </div>
          </div>
        </section>}
      </div>
    </div>
  )
}

function VariantEditor({ variant, supabase, productSlug, onSaved, onDeleted }: { variant: Variant; supabase: ReturnType<typeof supabaseBrowser>; productSlug: string; onSaved: () => void; onDeleted: () => void }) {
  const [label, setLabel] = useState(variant.label)
  const [sizeMl, setSizeMl] = useState(variant.size_ml != null ? String(variant.size_ml) : '')
  const [sku, setSku] = useState(variant.sku ?? '')
  const [price, setPrice] = useState(String(variant.price))
  const [stock, setStock] = useState(String(variant.stock))
  const [active, setActive] = useState(variant.active)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function save() {
    setSaving(true)
    await supabase.from('product_variants').update({
      label,
      size_ml: sizeMl ? Number(sizeMl) : null,
      sku: sku || null,
      price: Number(price),
      stock: Math.max(0, Number(stock)),
      active,
    }).eq('id', variant.id)
    setSaving(false)
    onSaved()
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return
    setUploading(true)
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
    const path = `${productSlug}/variants/${variant.id}-${safe}`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, cacheControl: '31536000', contentType: file.type })
    if (!uploadError) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      await supabase.from('product_variants').update({ image_url: data.publicUrl }).eq('id', variant.id)
      onSaved()
    }
    setUploading(false)
  }

  return (
    <div className="pm-variant pm-variant-card">
      <div className="pm-variant-image">
        {variant.image_url ? <img src={variant.image_url} alt={label} /> : <div className="pm-variant-noimage"><ImagePlus size={18} /></div>}
        <input ref={fileRef} type="file" hidden accept="image/*" onChange={(e) => { uploadImage(e.target.files?.[0]); e.currentTarget.value = '' }} />
        <button type="button" className="button small" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? <Loader2 size={13} /> : <ImagePlus size={13} />} Photo</button>
      </div>
      <label>Label<input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Lime Twist, 50ml" /></label>
      <label>Size (ml, optional)<input type="number" min="0" value={sizeMl} onChange={(e) => setSizeMl(e.target.value)} /></label>
      <label>SKU<input value={sku} onChange={(e) => setSku(e.target.value)} /></label>
      <label>Price<input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
      <label>Stock<input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} /></label>
      <label className="mini-switch"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active</label>
      <div className="pm-variant-actions">
        <button className="button small" onClick={save} disabled={saving}>{saving ? <Loader2 size={14} /> : <Check size={14} />} Save</button>
        <button className="icon-button danger" title="Delete variant" onClick={onDeleted}><Trash2 size={15} /></button>
      </div>
    </div>
  )
}
