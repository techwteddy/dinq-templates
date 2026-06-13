# SipStream 🍺

A real-time drinking card game built with Next.js, TypeScript, Tailwind CSS, PrimeReact, and Supabase.

## 🎮 Game Features

### ✅ **Core Functionality**

- **Real-time multiplayer gaming** with live updates
- **Multiple game types**: Kings Cup, Never Have I Ever, Custom Deck
- **Drink counter** with real-time synchronization
- **Player turn management** with automatic progression
- **Card drawing system** with random card generation
- **Game history tracking** with detailed action logs

### ✅ **Authentication & User Management**

- **Email/password authentication** via Supabase Auth
- **User profiles** with customizable usernames and display names
- **Online status tracking** (online, offline, in_game, away)
- **Session management** with automatic token refresh

### ✅ **Social Features**

- **Friends system** with friend requests and management
- **Real-time notifications** for friend requests and game invites
- **User search** to find and add friends
- **Online status indicators** for all friends
- **Game invitations** (coming soon)

### ✅ **Real-time Features**

- **Live game state synchronization** across all players
- **Real-time drink counter updates**
- **Instant player turn changes**
- **Live notifications** for game events
- **Real-time friend status updates**

### ✅ **UI/UX Features**

- **Mobile-first responsive design**
- **Glossy UI theme** with smooth animations
- **Parallax background** with custom branding
- **Dark theme** with orange/red color scheme
- **Loading states** and error handling
- **Toast notifications** for user feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sip-stream
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   - Go to your Supabase project
   - Navigate to the SQL Editor
   - Run the contents of `database-setup.sql`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Play

### Creating a Game

1. **Sign up/Login** with your email
2. **Click "Create New Game"** on the homepage
3. **Choose a game type** (Kings Cup, Never Have I Ever, Custom Deck)
4. **Enter a game name** and click "Create Game"
5. **Share the game ID** with friends to join

### Joining a Game

1. **Sign up/Login** with your email
2. **Click "Join Game"** on the homepage
3. **Enter the game ID** provided by the game creator
4. **Click "Join Game"** to enter the lobby

### Playing the Game

- **Drink Counter**: Track total drinks for the round
- **Draw Card**: Click the card button to draw a random card
- **Next Turn**: Advance to the next player
- **Add Drinks**: Increment the drink counter
- **Game History**: View all actions taken during the game

### Social Features

- **Add Friends**: Search for users and send friend requests
- **View Friends**: See your friends list with online status
- **Notifications**: Get real-time updates about friend requests and game events

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.5, TypeScript, Tailwind CSS
- **UI Components**: PrimeReact, PrimeFlex, PrimeIcons
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS with custom glossy theme
- **State Management**: React hooks with Supabase subscriptions

## 📱 Mobile-First Design

The app is designed with mobile-first principles:

- **Responsive layout** that works on all screen sizes
- **Touch-friendly buttons** and interactions
- **Optimized navigation** for mobile devices
- **Fast loading** with optimized bundle sizes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and providers
│   ├── providers/        # Context providers
│   └── types/           # TypeScript type definitions
└── types/                # Additional type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `.next`

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [CHANGELOG.md](./CHANGELOG.md) for recent updates
2. Ensure your database schema is up to date
3. Verify your environment variables are set correctly
4. Check the browser console for error messages

---

**Happy Gaming! 🍻**
