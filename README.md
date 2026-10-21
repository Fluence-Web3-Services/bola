# Bola

Say what you are throwing. Bola names the bin in one short line, then builds a shorter morning collection round for IIT Roorkee.

Built for SOCIOTHON 2026. The sort runs in the browser from a Hindi and English word list. ElevenLabs speaks the line. A Render Workflow can score each bin and return the round.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Put `ELEVENLABS_API_KEY` in `.env.local` to hear the line. Without it, the bins still show.

```bash
npm test
```

## Render

Web service, repo root:

- Build: `npm install && npm run build`
- Start: `npm start`

Workflow service, also repo root (the tasks import `lib/`):

- Build: `npm install`
- Start: `npm run workflow`

Blueprints cannot declare workflows yet, so create that service in the dashboard (New → Workflow). Then set `RENDER_WORKFLOW_TASK` on the web service to the slug from the task page, shaped `your-workflow/planRound`. Set `RENDER_API_KEY` on the web service too. The Round screen falls back to the local plan if Render is not configured.

## What is real

- Speech in through the browser, speech out through ElevenLabs.
- Sorting from a campus word list, not a camera model.
- A nearest-neighbour round that skips bins under 75% full.
- Workflow tasks `scoreBin` and `planRound`. `planRound` fans out one `scoreBin` run per bin, then orders the pickups.

## What is a projection

Fill levels and coordinates are demo data, not live sensors. The impact kilograms use the assumptions printed in the app. They are a target, not a count taken on campus.

## Talk

`Bola-SOCIOTHON-2026.pdf`
