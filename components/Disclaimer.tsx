import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <section className="py-12 sm:py-14 md:py-16 bg-amber-50 border-t border-b border-amber-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Important Disclosure
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Investbud AI provides informational and educational insights only and does
              not constitute financial, investment, or legal advice. Investbud AI is not
              a registered investment advisor or broker-dealer. Cryptocurrency
              investments carry significant risk, including the potential loss of
              principal. Market conditions can change rapidly, and past performance does
              not guarantee future results. Always conduct your own research and consult
              a licensed financial professional before making investment decisions. By
              using Investbud AI, you acknowledge that you are solely responsible for
              your investment decisions and outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
