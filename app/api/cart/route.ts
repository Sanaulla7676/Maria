import { NextResponse } from 'next/server'
import { z } from 'zod'

const cartMutation = z.object({
  action: z.enum(['add', 'update', 'remove']),
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  productName: z.string().min(1),
  variantName: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive().max(20),
})

export async function POST(request: Request) {
  const parsed = cartMutation.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid cart request' }, { status: 400 })
  return NextResponse.json({ ok: true, action: parsed.data.action, item: parsed.data })
}
