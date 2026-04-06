# GoTrade (Reset Build)

This is a clean reset build of GoTrade with:
- A brand-new frontend experience
- A simplified Express backend
- Fresh seed data for products and merchants

## Run locally

1. Install dependencies
   npm install

2. Configure environment variables
   Copy `.env.example` to `.env.local` and set values for:
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`

3. Start server
   npm start

4. Open
   http://localhost:3000

## API endpoints

- GET /api/products
- GET /api/merchants
- GET /api/merchant-products
- GET /api/search?q=<query>
- POST /api/refresh-merchants
- POST /api/scan (multipart field name: photo)

## Notes

- /api/scan currently returns a simulated detected product.
- /api/refresh-merchants simulates live market updates by varying prices and stock.
