import clsx from 'clsx'
import React from 'react'

import type { MessageProps } from './types'

export const Message: React.FC<MessageProps> = ({ className, error, message, success, warning }) => {
  const messageToRender = message || error || success || warning

  if (messageToRender) {
    return (
      <div
        className={clsx(
          'p-4 my-8 rounded-lg',
          {
            'bg-success ': Boolean(success),
            ' bg-warning': Boolean(warning),
            'bg-error': Boolean(error),
          },
          className,
        )}
      >
        {messageToRender}
      </div>
    )
  }
  return null
}
