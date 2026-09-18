/**
 * TypingIndicator.tsx — Animated "..." bubble shown when the other person is typing
 */

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2" role="status" aria-label="Other user is typing">
      <div className="bg-white border border-slate-200/90 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#4a4bd7]/60 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-[#4a4bd7]/60 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-[#4a4bd7]/60 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
