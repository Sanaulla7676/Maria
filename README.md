# Maria Perfumes

Production-grade perfume commerce storefront for Maria Perfumes, Bengaluru.

## Product architecture

- Semantic storefront navigation and SEO-ready page structure
- Product catalogue with category, gender, fragrance family, size and price metadata
- Search, filtering, sorting and product detail routes
- Persistent cart with quantity controls and subtotal calculation
- Checkout-ready customer/order data contract
- Wishlist and customer account surfaces
- Event fragrance stall enquiry flow
- Business/store profile and location information
- Structured product data and JSON-LD hooks
- Responsive mobile-first interface
- Accessibility-first controls and keyboard navigation
- No CDN dependency for core application behaviour

## Commerce boundaries

The frontend intentionally separates catalogue/cart/checkout state from payment fulfilment. A real payment provider, inventory service, transactional email/SMS and production database must be connected through server-side secrets before accepting live orders.

## Deployment

This branch is the production rebuild foundation. Run it behind HTTPS with a server-side API and environment variables for payment, database, analytics and messaging integrations.
