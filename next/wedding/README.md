# 💍 Koketso & Neo Digital Wedding Invitation

A beautiful, interactive story-style digital wedding invitation built with Next.js, featuring Instagram-like story navigation, elegant animations, and modern design.

## ✨ Features

- **Story-Style Navigation**: Tap/swipe through 10 elegant scenes like Instagram Stories
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Interactive Elements**: Envelope opening, animated timelines, and smooth transitions
- **RSVP System**: Built-in form with EmailJS integration
- **Social Sharing**: WhatsApp sharing, calendar export, and save-the-date functionality
- **Elegant Animations**: Framer Motion powered animations with floating elements
- **Wedding Theme**: Dusty Blue & White color scheme with romantic typography

## 🎨 Design Theme

- **Colors**: Dusty Blue (#A3BFD9), White (#FFFFFF), Silver (#C5C6C7), Soft Beige (#EAE6E1)
- **Typography**: Great Vibes (script), Playfair Display (serif)
- **Mood**: Calm, sacred, romantic, minimalist with modern Botswana cultural touch

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd our-day
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the invitation

## 📱 Story Scenes

1. **Envelope Intro** - Interactive envelope opening
2. **Blessing** - Family invitation with Setswana greeting
3. **Date & Theme** - Wedding date and color theme
4. **Venue** - Location details with Google Maps integration
5. **Schedule** - Timeline of wedding day events
6. **Dress Code** - Attire guidelines with color swatches
7. **RSVP** - Interactive form for guest responses
8. **Scripture** - Biblical blessing (Mark 10:9)
9. **Thank You** - Sharing and calendar options
10. **Extras** - Photo gallery and replay option

## ⚙️ Configuration

### EmailJS Setup (for RSVP)

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up a service and email template
3. Update the following in `Scene7RSVP.tsx`:
   - `serviceId`: Your EmailJS service ID
   - `templateId`: Your EmailJS template ID  
   - `publicKey`: Your EmailJS public key

### Audio Setup

1. Add a wedding music file to `public/audio/wedding-music.mp3`
2. Uncomment the audio code in `WeddingStory.tsx`

### Images

- Add engagement photos to `public/images/`
- Add Open Graph image as `public/og-image.jpg` (1200x630px)

## 🎵 Controls

- **Tap left/right**: Navigate between scenes
- **Tap center**: Pause/play auto-advance
- **Swipe**: Change scenes
- **Hold**: Pause current scene
- **Audio toggle**: Mute/unmute background music

## 📦 Deployment

### Netlify (Recommended)

1. Build the project:
```bash
pnpm build
```

2. Deploy the `out` folder to Netlify
3. Set up custom domain if desired

### Vercel

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Audio**: use-sound
- **Icons**: Lucide React
- **Gestures**: React Swipeable

## 📝 Customization

### Wedding Details

Update the wedding information in each scene component:
- Names, date, and location
- Schedule and timeline
- RSVP deadline
- Contact information

### Colors & Fonts

Modify the theme in `globals.css`:
- Update CSS custom properties for colors
- Change Google Fonts imports
- Adjust Tailwind color classes

### Content

Each scene is a separate component in `components/wedding/scenes/` for easy customization.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for Koketso & Neo's wedding. Feel free to use as inspiration for your own wedding invitation.

## 💝 Wedding Details

**Koketso Morapedi & Neo Letsholathebe**  
December 6, 2025  
Letsholathebe, Botswana

*"Therefore what God has joined together, let no one separate." - Mark 10:9*
