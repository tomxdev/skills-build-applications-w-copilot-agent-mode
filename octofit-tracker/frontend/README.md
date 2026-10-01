# OctoFit Tracker Frontend

React 19 presentation tier built with Vite, React Router, and Bootstrap.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## API configuration

In Codespaces, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` before starting Vite. Use `.env.example` as a template:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The app uses `https://<VITE_CODESPACE_NAME>-8000.app.github.dev/api` when the variable is set. If it is unset, the API URL safely falls back to `http://localhost:8000/api`. Restart the Vite dev server after changing environment variables. Do not put secrets in `VITE_` variables because Vite exposes them to client code.

## Run

```bash
npm run dev
```
