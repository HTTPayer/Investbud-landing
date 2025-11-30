# Investbud AI Documentation

Welcome to the Investbud AI documentation. This folder contains technical documentation for developers working on or integrating with Investbud.

## 📚 Documentation Index

### [SETUP.md](./SETUP.md)
Complete setup guide including:
- Environment configuration
- MetaMask wallet setup
- Backend connection
- Development workflow
- Troubleshooting

### [PAYMENT_FLOW.md](./PAYMENT_FLOW.md)
x402 payment system documentation:
- Payment flow architecture
- USDC payment handling
- Session management
- Multi-wallet support
- Error handling

### [BACKEND_FORMAT.md](./BACKEND_FORMAT.md)
Backend API specifications:
- `/advise` endpoint format
- `/chat` endpoint format
- Response schemas
- Error formats

## 🏗️ Architecture Overview

Investbud AI is a Next.js application that integrates:
- **OpenAI GPT-4**: RAG processing for compliance and formatting
- **x402-fetch**: Automated USDC payment handling
- **Akash Backend**: Hosted API for wallet analysis and chat
- **MetaMask**: Web3 wallet integration

## 🔑 Key Concepts

### Session Management
- Persistent session IDs stored in localStorage
- Backend maintains conversation context
- Reduces token usage for follow-up questions

### Payment Strategy
- `/advise`: 0.1 USDC per wallet analysis (once per day per wallet)
- `/chat`: Per-message payments for follow-up questions
- Automatic payment via x402-fetch (no manual signing per message)

### Wallet Analysis
- Detects wallet analysis requests via keywords and 0x patterns
- Routes to `/advise` for new wallets or first time of day
- Routes to `/chat` for follow-up questions
- Case-insensitive wallet address tracking

## 🚀 Quick Start

1. Clone the repository
2. Copy `.env.local.example` to `.env.local`
3. Add your OpenAI API key
4. Run `npm install`
5. Run `npm run dev`
6. Connect your MetaMask wallet (Base Sepolia testnet)

## 🛠️ Development

### Project Structure
```
investbud-landing/
├── app/
│   ├── api/
│   │   ├── advise/      # Proxy for wallet analysis
│   │   ├── chat/        # Proxy for chat messages
│   │   └── rag/         # OpenAI RAG processing
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── InvestbudChat.tsx  # Main chat component
├── lib/
│   ├── x402.ts          # Payment wrapper functions
│   └── constants.ts     # Configuration
├── hooks/
│   └── useMetaMask.ts   # Wallet connection
└── docs/                # This folder
```

### Key Files
- **InvestbudChat.tsx**: Main chat interface, handles routing logic
- **x402.ts**: Three payment wrapper functions for different endpoints
- **rag/route.ts**: Processes backend responses with GPT for compliance
- **advise/route.ts**: Proxies wallet analysis requests to backend
- **chat/route.ts**: Proxies chat requests to backend

## 🔐 Security Notes

- Never expose session IDs (grants access to conversation history)
- Session IDs stored in localStorage: `investbud_session_id`
- Payment tracking in localStorage: `investbud_last_advice_payment`
- All API calls require x402 payment header
- Backend validates USDC payments before processing

## 📝 Contributing

When making changes:
1. Keep console.logs removed for production
2. Maintain TypeScript types
3. Test with multiple wallets in same session
4. Verify payment flows work correctly
5. Update documentation as needed

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md#troubleshooting) for common issues and solutions.

## 📞 Support

For issues or questions, please open an issue on GitHub.
