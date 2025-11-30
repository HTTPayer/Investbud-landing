# Investbud AI Landing Page

AI-powered macro & portfolio co-pilot for crypto investors. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 16** with App Router
- ⚡ **React 19** with latest features
- 🎨 **Tailwind CSS** for styling
- 📱 **Fully Responsive** design
- 💬 **Interactive Chat** component with RAG-powered AI
- 🔒 **TypeScript** for type safety
- 🎯 **Lucide Icons** for beautiful UI elements

## Getting Started

### Installation

Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Documentation

For detailed setup and technical documentation, see the `docs/` folder:
- [Setup Guide](docs/SETUP.md) - Complete setup instructions
- [Payment Flow](docs/PAYMENT_FLOW.md) - x402 payment system documentation
- [Backend Format](docs/BACKEND_FORMAT.md) - API response format specifications

## Backend Integration

The chat expects `/chat` and `/advise` endpoints. See documentation for full API details.

## License

© 2024 Investbud AI
