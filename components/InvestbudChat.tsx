'use client';

import { useState, useRef } from 'react';
import { Send, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage, RegimeSignal, PortfolioSummary } from '../types/chat';
import { useMetaMask } from '../hooks/useMetaMask';
import { sendMessageWithX402, requestWalletAdviseWithX402, sendWalletChatWithX402 } from '../lib/x402';
import WalletModal from './WalletModal';

// Función para generar UUID compatible con todos los navegadores
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores que no soportan crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function InvestbudChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Session ID: Mantiene el contexto de la conversación en el backend
  // El backend usa esto para recordar el historial y contexto de wallet
  // IMPORTANTE: No compartir el session_id ya que cualquiera con él puede acceder al historial
  const [sessionId] = useState(() => {
    // Intentar recuperar session_id existente o crear uno nuevo
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('investbud_session_id');
      if (saved) return saved;
      const newId = generateUUID();
      localStorage.setItem('investbud_session_id', newId);
      return newId;
    }
    return generateUUID();
  });
  
  const [regimeSignal, setRegimeSignal] = useState<RegimeSignal>();
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [analyzedWalletAddress, setAnalyzedWalletAddress] = useState<string | null>(null);
  const [lastAdvicePaymentDate, setLastAdvicePaymentDate] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('investbud_last_advice_payment');
    }
    return null;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { address, isConnecting, error: walletError, provider, connect, disconnect, isConnected } = useMetaMask();

  // Helper: Detectar si el mensaje es sobre análisis de wallet
  const isWalletAnalysisRequest = (message: string): boolean => {
    const keywords = [
      'analiz', 'advice', 'portfolio', 'wallet', 'holdings', 'balance',
      'assets', 'tokens', 'my wallet', 'mi wallet', 'mi cartera',
      'analizar', 'revisar', 'checkear', 'verificar', '0x'
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Helper: Extraer wallet address del mensaje (formato 0x...)
  const extractWalletAddress = (message: string): string | null => {
    const walletRegex = /0x[a-fA-F0-9]{40}/;
    const match = message.match(walletRegex);
    return match ? match[0] : null;
  };

  // Helper: Verificar si ya se pagó advice hoy (usando hora local de la máquina)
  const hasAdvicePaymentToday = (): boolean => {
    if (!lastAdvicePaymentDate) return false;
    const now = new Date();
    const lastPayment = new Date(lastAdvicePaymentDate);
    
    // Comparar año, mes y día usando hora local
    return (
      now.getFullYear() === lastPayment.getFullYear() &&
      now.getMonth() === lastPayment.getMonth() &&
      now.getDate() === lastPayment.getDate()
    );
  };

  // Helper: Marcar que se pagó advice hoy
  const markAdvicePaymentToday = () => {
    const today = new Date().toISOString();
    setLastAdvicePaymentDate(today);
    if (typeof window !== 'undefined') {
      localStorage.setItem('investbud_last_advice_payment', today);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check wallet connection - show modal if not connected
    if (!isConnected || !provider) {
      setShowWalletModal(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setPaymentStatus('');

    try {
      const isWalletRequest = isWalletAnalysisRequest(userMessage.content);
      const extractedWallet = extractWalletAddress(userMessage.content);
      
      // Decidir qué endpoint usar
      // Si el usuario proporciona una nueva wallet address explícitamente, SIEMPRE usar /advise
      const isNewWalletRequest = extractedWallet && extractedWallet.toLowerCase() !== analyzedWalletAddress?.toLowerCase();
      const shouldUseAdvice = isWalletRequest && (!hasAdvicePaymentToday() || isNewWalletRequest);
      const shouldUseChat = isWalletRequest && hasAdvicePaymentToday() && !isNewWalletRequest && analyzedWalletAddress;
      
      // Para /advise usamos la wallet extraída o la conectada
      // Para /chat usamos la wallet analizada previamente
      const targetWalletAddress = shouldUseAdvice 
        ? (extractedWallet || address) 
        : analyzedWalletAddress;

      let data;

      if (shouldUseAdvice) {
        // Primera vez del día O nueva wallet: llamar /advise con pago usando x402
        setPaymentStatus('💳 Processing payment for wallet analysis (0.1 USDC)...');

        const walletAddrForAdvise = targetWalletAddress ?? address ?? '';
        if (!walletAddrForAdvise) {
          throw new Error('No wallet address available for wallet analysis');
        }
        
        data = await requestWalletAdviseWithX402(
          provider,
          walletAddrForAdvise,
          'base-mainnet',
          8453
        );
        
        // IMPORTANTE: Actualizar la wallet analizada INMEDIATAMENTE
        // Esto asegura que los follow-ups usen la wallet correcta
        setAnalyzedWalletAddress(walletAddrForAdvise);
        
        // Solo marcar pago si es la primera vez del día
        if (!hasAdvicePaymentToday()) {
          markAdvicePaymentToday();
        }
        
      } else if (shouldUseChat) {
        // Follow-up sobre wallet ya analizada
        setPaymentStatus('💳 Processing payment...');
        
        data = await sendWalletChatWithX402(
          provider,
          sessionId,
          userMessage.content,
          analyzedWalletAddress!,
          'base-mainnet'
        );
        
      } else {
        // Pregunta general: usar el flujo normal con x402
        const metadata = {
          user_agent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          wallet_address: address,
        };

        setPaymentStatus('💳 Processing payment...');
        
        data = await sendMessageWithX402(
          provider,
          sessionId,
          userMessage.content,
          metadata
        );
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Handle regime signal from both chat and advise responses
      if (data.regime_signal) {
        setRegimeSignal(data.regime_signal as unknown as RegimeSignal);
      } else if (data.macro_signal) {
        // Convert advise macro_signal to regime_signal format
        // Cast macro_signal to a known shape and use safe accessors/defaults
        const macro = data.macro_signal as { regime?: string; confidence?: number } | undefined;
        setRegimeSignal({
          current: (macro?.regime ?? '').toLowerCase().replace('-', '-'),
          confidence: macro?.confidence ?? 0,
          last_updated: data.timestamp,
        } as RegimeSignal);
      }

      // Parse the backend response - handle different response formats
      let backendResponseText = '';
      
      if (data.response) {
        try {
          // Convert Python dict string to JSON
          const pythonDictStr = data.response
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null');
          
          const parsed = JSON.parse(pythonDictStr);
          backendResponseText = parsed.response || data.response;
        } catch {
          // Fallback to raw response if parsing fails
          backendResponseText = data.response;
        }
      } else if (data.reply) {
        backendResponseText = data.reply;
      } else if (data.advice_id) {
        // This is an advise response - format it nicely
        backendResponseText = JSON.stringify(data, null, 2);
      } else {
        backendResponseText = JSON.stringify(data);
      }

      // Process response through RAG for compliance and context
      setPaymentStatus('🤖 Processing with AI...');
      
      // Determine if this response has wallet context
      const hasWalletContext = !!(data.advice_id || data.portfolio_analysis || (shouldUseChat && analyzedWalletAddress));
      
      const ragResponse = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessage.content,
          backendResponse: backendResponseText,
          userContext: JSON.stringify({
            regime: data.regime_signal || data.macro_signal,
            portfolio: data.portfolio_summary || data.portfolio_analysis,
            wallet_address: targetWalletAddress || analyzedWalletAddress || address,
            isAdviseResponse: !!data.advice_id,
            hasWalletContext,
            previousWalletAddress: analyzedWalletAddress,
          }),
        }),
      });

      if (!ragResponse.ok) {
        throw new Error('Failed to process with AI');
      }

      const { enhancedResponse } = await ragResponse.json();

      const assistantMessage: ChatMessage = {
        id: generateUUID(),
        role: 'assistant',
        content: enhancedResponse,
        timestamp: new Date(),
        regime_signal: data.regime_signal as RegimeSignal | undefined,
        portfolio_summary: data.portfolio_summary as PortfolioSummary | undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setPaymentStatus('✅ Complete');
      
      // Clear status after 2 seconds
      setTimeout(() => setPaymentStatus(''), 2000);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateUUID(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setPaymentStatus('❌ Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    const success = await connect();
    if (success) {
      setShowWalletModal(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearSessionAndRestart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('investbud_session_id');
      localStorage.removeItem('investbud_last_advice_payment');
    }
    setMessages([]);
    setAnalyzedWalletAddress(null);
    window.location.reload();
  };

  return (
    <>
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleConnectWallet}
        isConnecting={isConnecting}
        error={walletError}
      />
      
      <div className="flex flex-col h-[450px] sm:h-[500px] md:h-[600px] bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              IB
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Investbud AI</h3>
              {regimeSignal && (
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
                  {regimeSignal.current === 'risk-on' ? (
                    <><TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" /><span className="font-medium text-green-600 capitalize">{regimeSignal.current}</span></>
                  ) : (
                    <><TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600" /><span className="font-medium text-red-600 capitalize">{regimeSignal.current}</span></>
                  )}
                  <span className="text-gray-400 hidden xs:inline">·</span>
                  <span className="text-gray-500 hidden xs:inline">
                    {new Date(regimeSignal.last_updated).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-medium text-green-700">
                    {address?.slice(0, 4)}...{address?.slice(-3)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="text-[10px] sm:text-xs text-gray-600 hover:text-gray-900 px-1.5 sm:px-2 py-1 rounded hover:bg-gray-100"
                >
                  <span className="hidden xs:inline">Disconnect</span>
                  <span className="xs:hidden">✕</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-[11px] sm:text-xs md:text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                <span className="hidden xs:inline">Connect</span>
                <span className="xs:hidden">Connect</span>
              </button>
            )}
          </div>
        </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {!isConnected && (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold">
              <Wallet className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Connect Your Wallet
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 max-w-sm mx-auto px-4">
              Connect your wallet to start chatting with Investbud AI.
            </p>
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {isConnected && messages.length === 0 && (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold">
              💬
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Start a Conversation
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 max-w-sm mx-auto px-4">
              Ask about macro regimes, portfolio analysis, or market conditions.
            </p>
            <div className="flex flex-col gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 px-4">
              <p>&quot;What&apos;s the current macro regime?&quot;</p>
              <p>&quot;Analyze wallet 0x123...&quot;</p>
              <p>&quot;How correlated is BTC to risk assets?&quot;</p>
            </div>
          </div>
        )}

        {isConnected && messages.length > 0 && (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 sm:py-3 ${
                    message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm markdown-content">
                      <ReactMarkdown
                        components={{
                          h1: (props) => <h1 className="text-lg font-bold mb-2 mt-3" {...props} />,
                          h2: (props) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                          h3: (props) => <h3 className="text-sm font-semibold mb-1 mt-2" {...props} />,
                          p: (props) => <p className="mb-2 leading-relaxed" {...props} />,
                          ul: (props) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          ol: (props) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                          li: (props) => <li className="ml-2" {...props} />,
                          strong: (props) => <strong className="font-semibold" {...props} />,
                          em: (props) => <em className="italic" {...props} />,
                          code: (props) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs" {...props} />,
                          blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-3 italic my-2" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {message.portfolio_summary && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold mb-1">Portfolio Summary</p>
                      <p className="text-xs">
                        Total: ${message.portfolio_summary.total_value_usd.toLocaleString()}
                      </p>
                      <div className="mt-1 text-xs">
                        {message.portfolio_summary.top_holdings.slice(0, 3).map((holding: { symbol: string; percentage: number }) => (
                          <div key={holding.symbol}>
                            {holding.symbol}: {holding.percentage.toFixed(1)}%
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                    <span className="text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-600 bg-clip-text text-transparent">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
          {paymentStatus && (
            <div className="mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 border border-blue-200 rounded-lg text-[10px] sm:text-xs text-blue-700 text-center">
              {paymentStatus}
            </div>
          )}
          
          {hasAdvicePaymentToday() && analyzedWalletAddress && (
            <div className="mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-50 border border-green-200 rounded-lg text-[10px] sm:text-xs text-green-700 flex items-center justify-between">
              <span>✅ Wallet analysis active today: {analyzedWalletAddress.slice(0, 6)}...{analyzedWalletAddress.slice(-4)}</span>
              <span className="text-green-600 font-medium hidden xs:inline">No extra charge</span>
            </div>
          )}
          
          <div className="flex gap-1.5 sm:gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isConnected ? "Type your question..." : "Connect wallet to start..."}
              className="flex-1 px-3 sm:px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              disabled={isLoading || !isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || !isConnected}
              aria-label="Send message"
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-1.5 sm:mt-2 text-center leading-relaxed">
            💳 Each message requires USDC payment · You&apos;ll sign with MetaMask · ⓘ Not financial advice
          </p>
        </div>
      </div>
    </>
  );
}
