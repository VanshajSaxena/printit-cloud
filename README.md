# printit-cloud

The backend API for Printit. It keeps track of shops, their printers and orders, hands out upload and download links for files, and passes live updates between the students' web app and the shops' desktop app.

Printit let students send documents to a print shop from their phone. They opened a web app, picked a shop by scanning the QR code on its counter or from a list of nearby shops, uploaded PDFs and chose color and copies for each page. The shop's Windows PC printed the order and reported progress back to the student's phone as it happened.

Printit is shelved. I built it between August 2025 and July 2026 and I'm not maintaining it any more.

## How it fits with the rest of Printit

| Repository | Part |
| --- | --- |
| printit-cloud (this one) | The API: shops, orders, file storage, live notifications |
| [printit-pwa](https://github.com/VanshajSaxena/printit-pwa) | The web app students used on their phones |
| [printit-desktop](https://github.com/VanshajSaxena/printit-desktop) | The Electron app shops ran on their Windows PC |
| [win-print-service](https://github.com/VanshajSaxena/win-print-service) | The Windows print service the shop app talks to |

Both apps talk to this API. Files don't pass through it: the web app asks for signed upload URLs and uploads PDFs straight to Cloudflare R2, and the shop app downloads them with signed URLs in the same way. Both apps generate their TypeScript API types from the OpenAPI document this server publishes.

I wrote about the project at [vanshajsaxena.com/projects/printit](https://vanshajsaxena.com/projects/printit/). The posts on [the shop app's state machine](https://vanshajsaxena.com/posts/electron-state-machine/) and [the Windows print spooler](https://vanshajsaxena.com/posts/windows-print-spooler/) cover what happens once an order reaches a shop.

## What it does

- REST API under `/api/v1` for vendors (shops), printers, transactions (an order) and jobs (one document in an order with its print settings), plus documents, file links, auth and dashboard numbers for shops.
- Finds shops near a point with PostGIS (`ST_DWithin` on a geography column) and returns them sorted by distance.
- A Socket.IO namespace, `/notifications`, that tells a shop about new orders, sends job and order status to the student who placed the order, and tracks which shops are online.
- Shops sign in with email and password, or with Google or Microsoft. The API issues JWTs. Students don't have accounts. The web app sends an anonymous ID, which the API counts per shop for the shop's dashboard.
- Swagger UI at `/docs`, with the OpenAPI document at `/docs/json` and `/docs/yaml`.

Stack: NestJS 11, TypeScript, TypeORM, PostgreSQL with PostGIS, Socket.IO, Passport, the AWS S3 SDK (pointed at Cloudflare R2) and Swagger. It ran on Railway, built from the `Dockerfile`.

## Running it locally

You need Node.js, Yarn 4 (through Corepack) and PostgreSQL with the PostGIS extension. Docker is the quickest way to get the database:

```sh
docker run -d --name printit-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=printit \
  postgis/postgis:16-3.4
```

`yarn start` runs with `NODE_ENV=development` and reads `.env.development`:

```sh
DATABASE_URL=postgres://postgres:postgres@localhost:5432/printit
JWT_SECRET=change-me

R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_BUCKET_NAME=printit
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_CALLBACK_URL=http://localhost:3000/api/v1/auth/microsoft/callback
```

The server won't start without the R2 and OAuth settings, and it needs the database and the JWT secret to do anything. Placeholder values are enough to start it, but uploads need a real R2 bucket and the Google and Microsoft sign-in needs real OAuth apps.

```sh
corepack enable
yarn install
yarn start
```

In development TypeORM creates the tables on start. The API listens on port 3000 (set `PORT` to change it). `http://localhost:3000/api/v1/ping` should answer and `http://localhost:3000/docs` shows the API.

`yarn build` compiles to `dist/`. Most of the unit test files are the stubs Nest generated and were never kept up to date, so `yarn test` fails.

## License

MIT, see [LICENSE](LICENSE).
