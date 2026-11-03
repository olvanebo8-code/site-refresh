# Site Refresh — Restaurant website and Supabase ordering

The existing restaurant website, menu, reservation form, and visual identity remain in place. The ordering flow, kitchen view, and administrator views use Supabase for shared persistent data once configured.

## Pages

- Customer Speisekarte and cart: `/` and `/checkout.html`
- Choose a table and submit an order: `/tisch.html`
- Kitchen: `/kueche/`
- Admin financial overview and full order history: `/admin/`
- Admin overview of 20 tables and open bills: `/admin/tische.html`
- Printable/downloadable QR codes for Tisch 1–20: `/qr-codes/`

QR codes link to the site with `?table=N`. A valid value from 1 to 20 selects the table automatically. Invalid values are rejected and do not select a table.

## Supabase setup

GitHub Pages can serve the site, but Supabase provides the persistent database, staff authentication, permissions, and real-time updates.

1. Create a Supabase project.
2. In the Supabase SQL Editor, run the complete [`database/supabase.sql`](database/supabase.sql) file. It creates/seeds the 20 tables and menu products, creates the orders and kitchen tables, applies row-level security, and enables real-time changes.
3. In `supabase-config.js`, set the project URL and the **anon/public** key from Supabase Project Settings → API:

   ```js
   window.RESTAURANT_SUPABASE_CONFIG = {
     url: "https://YOUR-PROJECT.supabase.co",
     anonKey: "YOUR-ANON-PUBLIC-KEY"
   };
   ```

   These two values are intended for the browser. **Never add the `service_role` key, database password, or other secret to this file.** The backend policies and role checks protect staff data.
4. In Supabase Authentication, disable public sign-ups. Create staff accounts from the Supabase dashboard. Supabase sign-in uses an email address and password, rather than a username-only login.
5. In the Supabase SQL Editor, assign staff roles to the exact accounts you created. Replace the example email with that account's email:

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

   For a kitchen-only account, use `"role":"kitchen"` instead. The admin role can view prices and financial data; kitchen accounts can only read/update kitchen orders. A kitchen account cannot read the financial orders tables. A user must sign out and back in after changing the role so Supabase issues a token with the new role.
6. In Authentication → URL Configuration, set **Site URL** to `https://olvanebo8-code.github.io/site-refresh/` and add the same exact URL to **Redirect URLs**. This sends invitation links back to the published site.
7. Publish the changed site to GitHub Pages. The pages display a setup warning and do not create fake/local orders when Supabase is not configured.

An administrator invitation has been sent to the email address provided by the site owner, and that account has the `admin` role. The invite recipient must accept the email invitation and set a password before signing in. The project's public signup option is disabled; create additional staff through dashboard invitations and assign each account only the role it needs.

Invitation and password-recovery links that redirect to the site homepage are forwarded to `/admin/`, where the recipient can set a password. If an invitation link expires, open `/admin/`, enter the account email, and choose **Passwort vergessen?** to request a fresh recovery link. The user must set their own password; never store it in the website source.

Only the Supabase project URL and anon/public key belong in frontend configuration. Order submission calculates prices from active database products, validates quantities and table numbers in SQL, and uses an idempotency ID so a retry cannot create a duplicate order.

## Payments and table status

Orders are initially **Offen**; submitting an order never marks it paid. Admins can mark one order paid, or use **Tisch bezahlt & freigeben** to settle all open orders at a table. The database frees the table after its last open order is paid. An individual payment does not free a table if another unpaid order remains there. The table overview shows the outstanding amount only while a bill is open.

The admin page includes **Alle Bestellungen** and **Bestellungen heute** buttons. The financial overview uses paid orders for revenue totals. The kitchen view receives live order changes and shows product names, quantities, and special instructions without financial data.

## Table overview background image

The 20-table admin grid uses the project's existing `assets/food-spread.png` image with a light overlay. This reuses a local site asset rather than hotlinking an image found through Google; Google image results do not themselves grant reuse rights.

## Local development

1. Install Node.js 20 or newer.
2. Run `npm install`, then `npm start`.
3. Open <http://localhost:3000>.

The existing Node server continues to store reservations in SQLite. Ordering data is stored in Supabase, not in the local reservation database. Online ordering records payment status but does not process card payments.
