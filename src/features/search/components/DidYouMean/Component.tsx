'use client'

import React from 'react'
import type { DidYouMeanProps } from './types'

/**
 * DidYouMean Component
 * Renders "Bedoelde je: [suggestion1], [suggestion2]?" with clickable links
 */
const DidYouMean: React.FC<DidYouMeanProps> = ({ query, suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="text-sm text-grey-dark py-2">
      <span>Bedoelde je: </span>
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={suggestion}>
          <button
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-primary underline hover:text-primary/80 transition-colors font-medium"
          >
            {suggestion}
          </button>
          {index < suggestions.length - 1 && <span>, </span>}
        </React.Fragment>
      ))}
      <span>?</span>
    </div>
  )
}

export default DidYouMean
