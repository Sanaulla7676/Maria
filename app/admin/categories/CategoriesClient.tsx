'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createCategory, renameCategory, toggleCategoryActive, deleteCategory } from '@/app/admin/products/actions'

type Category = { id: string; name: string; active: boolean }

export function CategoriesClient({ initialCategories, counts }: { initialCategories: Category[]; counts: Record<string, number> }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [pending, startTransition] = useTransition()

  const add = () => {
    const name = newName.trim()
    if (!name) return
    startTransition(async () => {
      try {
        const created = await createCategory(name)
        setCategories((c) => [...c, created as Category].sort((a, b) => a.name.localeCompare(b.name)))
        setNewName('')
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not create category')
      }
    })
  }

  const rename = (id: string, name: string) => {
    setCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, name } : cat)))
  }

  const saveRename = (id: string, name: string) => {
    startTransition(async () => {
      try {
        await renameCategory(id, name)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not rename category')
      }
    })
  }

  const toggleActive = (id: string, active: boolean) => {
    setCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, active } : cat)))
    startTransition(async () => {
      try {
        await toggleCategoryActive(id, active)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not update category')
      }
    })
  }

  const remove = (id: string) => {
    if ((counts[id] ?? 0) > 0 && !confirm('This category still has products assigned. Remove it anyway?')) return
    setCategories((c) => c.filter((cat) => cat.id !== id))
    startTransition(async () => {
      try {
        await deleteCategory(id)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not delete category')
      }
    })
  }

  return (
    <div className="admin-card" style={{ padding: 26, maxWidth: 720 }}>
      <div className="cat-list">
        {categories.map((cat) => (
          <div className="cat-row" key={cat.id}>
            <input value={cat.name} onChange={(e) => rename(cat.id, e.target.value)} onBlur={(e) => saveRename(cat.id, e.target.value)} />
            <span style={{ fontSize: 12, color: '#8a827a', whiteSpace: 'nowrap' }}>{counts[cat.id] ?? 0} products</span>
            <label className="mini-switch">
              <input type="checkbox" checked={cat.active} onChange={(e) => toggleActive(cat.id, e.target.checked)} /> Active
            </label>
            <button className="icon-button danger" title="Delete category" onClick={() => remove(cat.id)} disabled={pending}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {!categories.length && <p style={{ color: '#8a827a', fontSize: 13 }}>No categories yet — add your first one below.</p>}
      </div>

      <form className="cat-add" onSubmit={(e) => { e.preventDefault(); add() }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category (e.g. Attar, Discovery Set)" />
        <button className="button" type="submit" disabled={pending}>
          {pending ? <Loader2 size={15} className="spin" /> : <Plus size={15} />} Add
        </button>
      </form>
    </div>
  )
}
