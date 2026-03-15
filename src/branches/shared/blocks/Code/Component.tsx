import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { CopyButton } from './CopyButton'
import type { CodeBlockProps } from './types'

/**
 * B-11 - Code Block Component
 *
 * Displays formatted code with:
 * - Dark background (bg-[#0A1628])
 * - Monospace font (font-mono)
 * - Optional filename header bar
 * - Optional line numbers
 * - Optional copy-to-clipboard button (client component)
 */

export const CodeBlockComponent: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  showLineNumbers = true,
  showCopyButton = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!code) return null

  const lines = code.split('\n')

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
    >
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1628] shadow-lg">
            {/* Filename header bar */}
            {filename && (
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#0D1D33] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-coral/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <span className="h-3 w-3 rounded-full bg-green/70" />
                </div>
                <span className="ml-2 text-xs text-white/50 font-mono">{filename}</span>
              </div>
            )}

            {/* Code content */}
            <div className="relative">
              {/* Copy button (top-right) */}
              {showCopyButton && (
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton code={code} />
                </div>
              )}

              <div className="overflow-x-auto p-4">
                <pre className="font-mono text-sm leading-relaxed">
                  <code>
                    {lines.map((line, index) => (
                      <div key={index} className="flex">
                        {showLineNumbers && (
                          <span className="mr-6 inline-block w-8 select-none text-right text-white/20">
                            {index + 1}
                          </span>
                        )}
                        <span className="flex-1 text-gray-200">{line || '\u00A0'}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Language badge */}
            {language && (
              <div className="border-t border-white/10 px-4 py-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                  {language}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default CodeBlockComponent
