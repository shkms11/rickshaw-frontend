# Rickshaw Frontend

React, TypeScript, and Vite client for the Rickshaw Traffic Management System.

## Run locally

1. Start the backend at `http://localhost:5000` (see the backend README).
2. From this directory, run:

   ```powershell
   npm ci
   npm run dev
   ```

3. Open the Vite URL shown in the terminal. To use another API URL, set
   `VITE_API_URL` (for example, `http://localhost:5000/api`) in a local `.env`.

Public driver and owner registrations require administrator approval before
login. The header language control switches between English and Bangla, and
language and text-size preferences are saved in the browser.

Drivers can start GPS sharing from their dashboard after allowing browser
location permission. Their owner sees recent reports on the live map; admins
see all active reports. Sharing stops when the driver stops it or closes the
dashboard, and reports older than two minutes are not shown as live. GPS
requires HTTPS in production (localhost is allowed during development).

## Verify

```powershell
npm run build
npm run lint
```
