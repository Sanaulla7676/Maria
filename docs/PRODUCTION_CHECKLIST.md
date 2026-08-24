# Maria Production Checklist

## Environment
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MARIA_UPI_ID`

## Release gates
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Verify authenticated checkout
- [ ] Verify UTR submission and admin verification
- [ ] Verify inventory reservation and release
- [ ] Verify shipped/delivered transitions
- [ ] Verify workshop booking capacity
- [ ] Verify quotation creation and print/share
- [ ] Verify mobile navigation and forms
- [ ] Verify Supabase security advisors are reviewed
- [ ] Verify notification provider credentials before enabling WhatsApp/email delivery
