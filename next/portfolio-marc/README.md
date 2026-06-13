# Portfolio Website

A modern, responsive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern and beautiful UI design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and optimized with Next.js
- 🎭 Smooth animations with Framer Motion
- 🌙 Dark mode support
- 📧 Contact form
- 🤖 Flowise AI Chatbot integration
- 🚀 SEO optimized

## Sections

- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **About Section**: Personal information and background
- **Skills Section**: Technical skills with progress bars
- **Projects Section**: Showcase of featured projects
- **Contact Section**: Contact form and social media links

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Flowise Chatbot Setup

1. **Set up your Flowise instance**:
   - Install and run Flowise locally or use a hosted instance
   - Create and deploy your chatbot flow in Flowise
   - Note your Flow ID from the flow settings

2. **Configure environment variables**:
   - Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   - Update the environment variables:
     - `FLOWISE_API_URL`: Your Flowise API endpoint
       - Format: `http://your-flowise-url/api/v1/prediction/YOUR_FLOW_ID`
       - Example: `http://localhost:3000/api/v1/prediction/abc123xyz`
     - `FLOWISE_API_KEY`: (Optional) API key if your Flowise instance requires authentication

3. **Get your Flow ID**:
   - In Flowise, go to your deployed flow
   - Click on the flow settings
   - Copy the Flow ID from the URL or settings page
   - Replace `YOUR_FLOW_ID` in the `FLOWISE_API_URL`

4. **Test the chatbot**:
   - Restart your Next.js development server after adding environment variables
   - The chatbot will appear as a floating button in the bottom-right corner
   - Click the button to open the chat interface

**Note**: The chatbot uses a Next.js API route (`/api/chat`) to proxy requests to Flowise, which helps avoid CORS issues and keeps your API keys secure.

## Customization

### Update Personal Information

1. **Hero Section**: Edit `components/Hero.tsx` to change your name and title
2. **About Section**: Update `components/About.tsx` with your information
3. **Skills**: Modify the skills array in `components/Skills.tsx`
4. **Projects**: Update the projects array in `components/Projects.tsx`
5. **Contact**: Change email and social links in `components/Contact.tsx`
6. **Metadata**: Update `app/layout.tsx` with your site title and description

### Styling

The project uses Tailwind CSS for styling. You can customize colors in `tailwind.config.js`.

## Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Add Environment Variables** (if using Nodemailer):
   - Go to Project Settings → Environment Variables
   - Add: `EMAIL_USER`, `EMAIL_PASSWORD`, `RECIPIENT_EMAIL`
   - Redeploy after adding variables

Your site will be live at `https://your-project.vercel.app`

For detailed instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Other Platforms

This portfolio can also be deployed on:

- [Netlify](https://netlify.com)
- Any platform that supports Node.js

## Technologies Used

- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations

## License

This project is open source and available under the MIT License.

