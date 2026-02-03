import type { Message } from '@/types'

interface Props {
  message: Message
}

/**
 * Individual message bubble component
 */
export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  const formattedTime = message.timestamp.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div
        className={`
          max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-md
          ${
            isUser
              ? 'bg-habs-navy text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
          }
        `}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-habs-gold animate-pulse" />
          )}
        </div>

        {/* Sources (for assistant messages) */}
        {!isUser && message.sources && message.sources.length > 0 && !message.isStreaming && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Sources:</p>
            <ul className="space-y-1">
              {message.sources.map((source, index) => (
                <li
                  key={index}
                  className="text-xs text-habs-navy/70 flex items-start gap-1"
                >
                  <span className="text-habs-gold">•</span>
                  <span>
                    {source.source} — {source.section}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-white/60' : 'text-gray-400'
          }`}
        >
          {formattedTime}
        </p>
      </div>
    </div>
  )
}
