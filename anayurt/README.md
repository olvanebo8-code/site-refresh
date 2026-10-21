# Ana Yurt website

The website keeps its existing design and serves reservations through a small JavaScript server. Reservation requests are stored in a local SQLite database. The menu has a browser-based cart and checkout summary; payment is completed on Lieferando.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm install`.
3. Run `npm start` and open <http://localhost:3000>.

The server creates `data/ana-yurt.sqlite` automatically and initializes it from `database/schema.sql`. The database file is local and is excluded from Git. Reservation requests remain available in that file after the server restarts.

The site must be opened through the server URL for reservations to work. Opening `index.html` directly from the file system will not reach the API.

Cart quantities are saved in the visitor's browser. The checkout page shows the selected items and subtotal, then opens Ana Yurt's Lieferando menu for ordering and payment. The site cannot transfer the cart into Lieferando, so customers select the items again there; Lieferando shows the final payable total.
