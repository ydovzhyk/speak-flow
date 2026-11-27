# SpeakFlow - Frontend

Live speech transcription and translation web app. Captures microphone or tab audio, streams it to the backend in real time, and displays source text alongside AI-powered translation.

**Live:** [https://speakflow.art](https://speakflow.art)

SpeakFlow is **under active development**. While in this stage, monthly recording time is limited to **20 minutes** for guests and **40 minutes** for registered users (enforced by the backend).

**Public pages:** [How it works](https://speakflow.art/how-it-works) · [Privacy](https://speakflow.art/privacy) · [Terms](https://speakflow.art/terms)

---

## Features

- Real-time transcription and translation in dual live panels
- Input/output language selection (30+ languages)
- Audio sources: microphone, speaker (tab capture), auto-switch
- Record, pause, and stop with active-time usage tracking
- Guest and registered user modes with monthly quotas (20 / 40 min while in development)
- Email/password auth and Google OAuth
- Saved transcription records with linked sentence highlight
- Settings, contact form, responsive layout
- INFO guide + Privacy / Terms / How it works pages

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS, Framer Motion |
| State | Redux Toolkit, redux-persist |
| Realtime | Socket.io client |
| Audio | Web Audio API (PCM16 streaming) |
| HTTP | Axios (JWT + HttpOnly refresh cookies) |
| Deploy | Vercel |

---

## Architecture

```
Browser (mic / tab audio)
  → useAudioRecorder (PCM16 chunks)
  → useSocket (Socket.io)
  → speak-flow-server
  ← final (transcript) + final-transleted (translation)
  → useStreamingParagraph (typewriter UX)
  → LiveTextPanels
```

The frontend handles capture, session state, and presentation. Transcription, translation, and usage enforcement run on the backend.

---

## Prerequisites

- Node.js 18+
- Running [speak-flow-server](https://github.com/yuriydovzhyk/speak-flow-server) (local or Heroku)

---

## Getting Started

```bash
git clone <repo-url>
cd speak-flow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Point to local backend

Update the API base URL in:

- `src/api/auth.js`
- `src/app/hooks/useSocket.jsx`
- `src/components/auth/index.jsx`

Default production URL:

```
https://speak-flow-server-fe4ec363ae5c.herokuapp.com
```

For local development, switch to `http://localhost:4000`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint with auto-fix |
| `npm run format` | Prettier |

---

## Project Structure

```
src/
├── app/                 # Next.js App Router (layout, page, hooks)
├── api/                 # Axios clients (auth, guest, usage, records)
├── components/          # UI (main-app, live panels, auth, settings)
├── redux/               # Auth and session state
├── utils/               # Audio recorder, socket provider, auth helpers
└── data/languages.js    # Language options for selectors
```

---

## Deployment (Vercel)

1. Connect the repository to Vercel.
2. Set the custom domain (`speakflow.art`).
3. Ensure the backend CORS allows `https://speakflow.art`.
4. Add `https://speakflow.art` to Google OAuth **Authorized JavaScript origins**.

No frontend secrets are required for core transcription/translation - API keys live on the server.

---

## Related Repository

Backend API and WebSocket server: **speak-flow-server**

---

## License

Private project.
