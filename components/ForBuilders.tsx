import { Code2, Zap, GitBranch } from 'lucide-react';

export default function ForBuilders() {
  return (
    <section id="for-builders" className="py-16 sm:py-20 md:py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs sm:text-sm text-blue-400 mb-4 sm:mb-6">
              <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
              For Developers
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Built for Integration
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Investbud AI exposes MCP (Model Context Protocol) tools for seamless
              integration into your workflows and applications.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm sm:text-base">LLM Workflows</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Use with Claude, ChatGPT, or any MCP-compatible AI system
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm sm:text-base">
                    Automation Platforms
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Integrate with n8n, Make, Zapier, and custom pipelines
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm sm:text-base">Custom DeFi Apps</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Access regime signals and portfolio analysis as callable functions
                  </p>
                </div>
              </div>
            </div>

            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto">
              MCP Documentation Coming Soon
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex gap-1 sm:gap-1.5">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 ml-1 sm:ml-2 truncate">mcp-config.json</span>
            </div>
            <div className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
              <pre className="text-xs sm:text-sm text-gray-300 min-w-max">
              <code>{`{
  "mcpServers": {
    "investbud": {
      "url": "https://api.investbudai.xyz",
      "tools": [
        {
          "name": "get_regime",
          "description": "Get macro regime signal"
        },
        {
          "name": "analyze_portfolio",
          "description": "Analyze wallet holdings"
        },
        {
          "name": "get_advisory",
          "description": "Get investment insights"
        }
      ]
    }
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
