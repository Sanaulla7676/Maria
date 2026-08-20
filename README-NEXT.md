# Maria Perfumes · Premium commerce stack

Maria is now structured as a Next.js App Router storefront with a Supabase backend.

## Stack
- Next.js 16 App Router + React 19
- TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Lucide icons
- Framer Motion
- React Hook Form + Zod
- TanStack Query
- Sonner
- Supabase Auth + Postgres + Storage + RLS

## Commerce model
Customers browse live products from Supabase, choose variants, add to a local bag, and submit an order request through a security-definer RPC. No online payment gateway is present.

Orders are persisted in Supabase with a unique order code, customer record, line items, prices, quantities and status. Variant stock is decremented atomically by the RPC.

## Owner model
`/dashboard` uses Supabase Auth. Authenticated owners can manage catalogue data and order status. Product images are uploaded to the `product-images` Storage bucket and their public URLs are stored in `product_images`.

## Environment
Copy `.env.example` to `.env.local` and add the Supabase publishable key. Never expose a Supabase secret/service-role key in the browser.

## Run
`npm install`
`npm run dev`

## Production
Set the two `NEXT_PUBLIC_SUPABASE_*` variables in the deployment environment, create the owner Auth account in Supabase, then sign into `/dashboard`.
