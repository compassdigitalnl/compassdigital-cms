'use client'

import React from 'react'
import type { AlphabetNavProps } from './types'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const AlphabetNav: React.FC<AlphabetNavProps> = ({
  availableLetters,
  activeLetter,
  onLetterClick,
  className = '',
}) => {
  return (
    <nav
      className={`sticky top-[120px] z-[100] rounded-xl border border-[var(--grey,#E8ECF1)] bg-white px-4 py-3 ${className}`}
      aria-label="Alfabet navigatie"
    >
      <div className="flex flex-wrap justify-center gap-1">
        {ALPHABET.map((letter) => {
          const isAvailable = availableLetters.includes(letter)
          const isActive = activeLetter === letter

          return (
            <button
              key={letter}
              onClick={() => isAvailable && onLetterClick(letter)}
              disabled={!isAvailable}
              aria-label={`Ga naar merken met letter ${letter}`}
              aria-current={isActive ? 'true' : undefined}
              className={`
                flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[13px] font-semibold transition-all duration-200
                ${isActive
                  ? 'bg-theme-teal text-white'
                  : isAvailable
                    ? 'text-theme-navy hover:bg-theme-teal/10 hover:text-theme-teal'
                    : 'cursor-not-allowed text-theme-grey-mid/50'
                }
              `}
            >
              {letter}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
