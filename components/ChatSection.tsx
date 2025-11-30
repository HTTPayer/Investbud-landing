'use client';

import { MessageSquare } from 'lucide-react';
import InvestbudChat from './InvestbudChat';

export default function ChatSection() {
  return (
    <section id="chat-section" className="py-12 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm text-blue-600 mb-4 sm:mb-6">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              For Investors
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6">
              Chat-First Analysis
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-8 leading-relaxed">
              Talk to Investbud AI like you&apos;d talk to an analyst. Get instant insights
              on macro conditions, portfolio composition, and market context.
            </p>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-base text-gray-600">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>&quot;What&apos;s the current macro regime?&quot;</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                <span>&quot;Analyze wallet 0x123...&quot;</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span>&quot;How correlated is my portfolio to BTC?&quot;</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-8 p-2.5 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-[10px] sm:text-sm text-gray-700">
                <span className="font-semibold">Powered by RAG:</span> Retrieval-augmented
                generation with our research docs, plus live calls to macro and on-chain
                data sources.
              </p>
            </div>
          </div>

          <div>
            <InvestbudChat />
          </div>
        </div>
      </div>
    </section>
  );
}
