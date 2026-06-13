# VoiceJournal

I tried journaling by writing. I had so many thoughts racing through my mind, but writing all of them down was exhausting — by the time I finished one sentence, three more had slipped away. I wished I could just *say* my thoughts instead. So I built this app.

**VoiceJournal** lets you speak your thoughts and instantly turns them into written journal entries. It supports English and Urdu with real-time transcription, so you can journal at the speed of thought.

Deployed link: https://voicejournal-sigma.vercel.app/

## Features

- Voice-to-text journaling with real-time transcription
- Multilingual support (English & Urdu with RTL)
- Full CRUD — create, edit, and delete notes
- Audio playback of original recordings
- Light / dark mode
- Email-based authentication

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui 
- **Auth & Database**: Supabase (PostgreSQL, Auth, Storage)
- **Speech-to-Text**: OpenAI Whisper API
- **Deployment**: Vercel

## Getting Started

```bash
git clone https://github.com/<your-username>/ai-voice-journaling-app.git
cd ai-voice-journaling-app
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
OPENAI_API_KEY=<your-openai-key>
```

Then run:

```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
