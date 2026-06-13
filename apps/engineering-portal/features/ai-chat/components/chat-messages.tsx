import { UIMessage } from 'ai';

export default function ChatMessages({ messages }: { messages: UIMessage[] }) {
  return (
    <>
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
                      relative max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm
                      ${
                        m.role === 'user'
                          ? 'bg-primary-100 text-white font-medium rounded-2xl rounded-tr-sm'
                          : 'bg-charcoal-800/80 text-neutral-100 rounded-2xl rounded-tl-sm border border-white/5'
                      }
                    `}
          >
            {m.parts.map((part, i) => {
              if (part.type === 'text')
                return (
                  <span key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </span>
                );
              return null;
            })}
          </div>
        </div>
      ))}
    </>
  );
}
