/**
 * TypingIndicator.tsx — Animated "..." bubble shown when the other person is typing
 */

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2" role="status" aria-label="Other user is typing">
      <div className="bg-gray-800/60 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
