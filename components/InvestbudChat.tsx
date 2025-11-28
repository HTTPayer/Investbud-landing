'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import type { ChatMessage, ChatRequest, ChatResponse } from '../types/chat';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export default function InvestbudChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [regimeSignal, setRegimeSignal] = useState<ChatMessage['regime_signal']>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody: ChatRequest = {
        session_id: sessionId,
        message: userMessage.content,
        metadata: {
          user_agent: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.regime_signal) {
        setRegimeSignal(data.regime_signal);
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        regime_signal: data.regime_signal,
        portfolio_summary: data.portfolio_summary,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
            IB
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Investbud AI</h3>
            {regimeSignal && (
              <div className="flex items-center gap-1.5 text-xs">
                {regimeSignal.current === 'risk-on' ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={regimeSignal.current === 'risk-on' ? 'text-green-600' : 'text-red-600'}>
                  {regimeSignal.current === 'risk-on' ? 'Risk-On' : 'Risk-Off'}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  {new Date(regimeSignal.last_updated).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              IB
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Start a Conversation
            </h4>
            <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
              Ask about macro regimes, portfolio analysis, or market conditions.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <p>"What's the current macro regime?"</p>
              <p>"Analyze wallet 0x123..."</p>
              <p>"How correlated is BTC to risk assets?"</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.portfolio_summary && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <p className="text-xs font-semibold mb-1">Portfolio Summary</p>
                  <p className="text-xs">
                    Total: ${message.portfolio_summary.total_value_usd.toLocaleString()}
                  </p>
                  <div className="mt-1 text-xs">
                    {message.portfolio_summary.top_holdings.slice(0, 3).map((holding) => (
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
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          ⓘ Not financial advice · For informational purposes only
        </p>
      </div>
    </div>
  );
}
