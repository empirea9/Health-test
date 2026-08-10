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
