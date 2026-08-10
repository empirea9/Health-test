# medic.in

A healthcare dashboard with:

- **Home** — yearly healthcare activity and upcoming appointments.
- **Docs** — healthcare transcripts, bills, documents, and files.
- **Meds** — ABDM medicine search, dose-form results, and a persistent cart.
- **Maps** — nearby clinics, hospitals, and pharmacies.

## Run locally

The Store search uses a server-side proxy so the ABDM credential is never exposed in browser code.

```bash
ABDM_API_KEY="your-abdm-api-key" node server.js
```

Then open <http://127.0.0.1:8000> and select **Meds**.

Without `ABDM_API_KEY`, the dashboard still runs and the Store displays a configuration message when searched.

## ABDM data

Medicine results come from the ABDM Drug Registry sandbox search API. The registry supplies medicine identity and clinical metadata; it does not supply retail prices or pharmacy inventory.

## Deploy on a VM with Cloudflare Tunnel

Prerequisites: a Linux VM with Docker Engine and Docker Compose, a domain managed by Cloudflare, an ABDM API key, and a remotely managed Cloudflare Tunnel token.

1. Clone the repository on the VM and enter its directory.
2. Create the secret file:

   ```bash
   cp .env.example .env
   nano .env
   ```

3. In Cloudflare Zero Trust, create a remotely managed tunnel. Add a published application hostname and set its service URL to `http://app:8000`.
4. Paste the ABDM API key and tunnel token into `.env`, then deploy:

   ```bash
   docker compose up -d --build
   docker compose ps
   docker compose logs -f cloudflared
   ```

The application binds to the VM loopback interface at <http://127.0.0.1:8000> for local diagnostics. Public traffic enters only through Cloudflare Tunnel. The VM firewall must allow outbound TCP port `7844`; UDP `7844` can also be allowed if the `--protocol http2` option is removed from `compose.yaml`.

To update later:

```bash
git pull
docker compose up -d --build
```
