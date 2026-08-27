'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Plus, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { createProduct, upsertVariant } from '../actions'
import type { Category } from '@/lib/types'

type Variant = { label: string; sizeMl: string; price: number; stock: number; active: boolean }

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [family, setFamily] = useState('Signature Perfumes')
  const [gender, setGender] = useState('Unisex')
  const [badge, setBadge] = useState('40% PURE OIL')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState<string[]>([])
  const [noteInput, setNoteInput] = useState('')
  const [featured, setFeatured] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([
    { label: '30ml', sizeMl: '30', price: 600, stock: 0, active: true },
    { label: '50ml', sizeMl: '50', price: 1000, stock: 0, active: true },
    { label: '100ml', sizeMl: '100', price: 1800, stock: 0, active: true },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const onNameChange = (value: string) => {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const addNote = () => {
    const value = noteInput.trim()
    if (!value) return
    setNotes((n) => [...n, value])
    setNoteInput('')
  }

  const addVariant = () => setVariants((v) => [...v, { label: `Variant ${v.length + 1}`, sizeMl: '', price: 0, stock: 0, active: true }])

  const save = async () => {
    setError('')
    if (!name.trim() || !slug.trim()) return setError('Product name and slug are required.')
    if (!categoryId) return setError('Choose a category.')
    setSaving(true)
    try {
      const productId = await createProduct({
        slug: slug.trim(),
        name: name.trim(),
        categoryId,
        family,
        gender,
        badge,
        description,
        notes,
        featured,
      })
      for (const v of variants) {
        await upsertVariant({
          productId,
          sizeMl: v.sizeMl ? Number(v.sizeMl) : null,
          label: v.label.trim() || `${name.trim()} variant`,
          price: v.price,
          stock: v.stock,
          active: v.active,
        })
      }
      toast.success('Product created')
      router.push(`/admin/products/${productId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="container admin-page">
      <Link className="back-link" href="/admin/products"><ArrowLeft size={16} /> Products</Link>
      <section className="admin-header">
        <div><span className="kicker">Catalog management</span><h1>Add fragrance</h1><p>Create a product and its sellable size variants.</p></div>
        <button className="button primary" onClick={save} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save product
        </button>
      </section>
      {error && <div className="error-note">{error}</div>}

      <section className="detail-grid">
        <article className="detail-card">
          <span className="kicker">Product</span>
          <div className="form-grid">
            <label>Product name<input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Oud Wood" /></label>
            <label>Slug<input value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true) }} placeholder="oud-wood" /></label>
            <label>Category
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>Family / Collection<input value={family} onChange={(e) => setFamily(e.target.value)} placeholder="Woody / Amber" /></label>
            <label>Ideal for
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option>Unisex</option>
                <option>Men</option>
                <option>Women</option>
              </select>
            </label>
            <label>Badge<input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="40% Pure Oil" /></label>
            <label className="toggle-row"><span>Featured product</span><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /></label>
            <label className="wide">Description<textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Fragrance description" /></label>
          </div>
        </article>

        <article className="detail-card">
          <span className="kicker">Fragrance notes</span>
          <div className="pm-notes" style={{ marginTop: 12 }}>
            {notes.map((note) => (
              <span key={note} className="pm-note-chip">
                {note}
                <button type="button" onClick={() => setNotes((n) => n.filter((x) => x !== note))} aria-label={`Remove ${note}`}><X size={12} /></button>
              </span>
            ))}
            <form className="pm-note-add" onSubmit={(e) => { e.preventDefault(); addNote() }}>
              <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Add a note (e.g. Sandalwood)" />
              <button type="submit"><Plus size={13} /> Add</button>
            </form>
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: '#777069' }}>
            Product photos and additional media can be uploaded from the product manager after saving.
          </p>
        </article>
      </section>

      <section className="detail-card variants-editor">
        <div className="section-head">
          <div><span className="kicker">Variants</span><h2>Unlimited — label, size, price &amp; stock</h2></div>
          <button className="button" onClick={addVariant}><Plus size={15} /> Add variant</button>
        </div>
        {variants.map((variant, index) => (
          <div className="variant-row" key={index}>
            <label>Label<input value={variant.label} onChange={(e) => setVariants((v) => v.map((x, i) => (i === index ? { ...x, label: e.target.value } : x)))} placeholder="e.g. 30ml, Lime Twist" /></label>
            <label>Size (ml, optional)<input type="number" min="0" value={variant.sizeMl} onChange={(e) => setVariants((v) => v.map((x, i) => (i === index ? { ...x, sizeMl: e.target.value } : x)))} /></label>
            <label>Price<input type="number" min="0" value={variant.price} onChange={(e) => setVariants((v) => v.map((x, i) => (i === index ? { ...x, price: Number(e.target.value) } : x)))} /></label>
            <label>Stock<input type="number" min="0" value={variant.stock} onChange={(e) => setVariants((v) => v.map((x, i) => (i === index ? { ...x, stock: Number(e.target.value) } : x)))} /></label>
            <label className="toggle"><input type="checkbox" checked={variant.active} onChange={(e) => setVariants((v) => v.map((x, i) => (i === index ? { ...x, active: e.target.checked } : x)))} /> Active</label>
            <button className="icon-button" title="Remove variant" onClick={() => setVariants((v) => v.filter((_, i) => i !== index))}><Trash2 size={17} /></button>
          </div>
        ))}
        <p style={{ marginTop: 14, fontSize: 12, color: '#777069' }}>Add per-variant photos from the product manager after saving.</p>
      </section>
    </main>
  )
}
