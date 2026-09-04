'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { platformServices } from '@/services/platform.services';

type TChatRole = 'user' | 'assistant';

type TChatMessage = {
  id: string;
  role: TChatRole;
  content: string;
};

const suggestions = [
  'Suggest 3 budget-friendly events for this weekend',
  'What are good team-building event ideas?',
  'How can I promote my event better?',
];

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const getReplyText = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const reply = record.reply;

  if (typeof reply !== 'string' || !reply.trim()) {
    return null;
  }

  return reply;
};

const initialAssistantMessage: TChatMessage = {
  id: createId(),
  role: 'assistant',
  content:
    'Hi! I can help with event suggestions, planning ideas, and general questions. What are you looking for today?',
};

export default function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<TChatMessage[]>([
    initialAssistantMessage,
  ]);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const trimmedInput = input.trim();
  const canSend = trimmedInput.length > 0 && !isSending;

  const historyPayload = useMemo(
    () =>
      messages
        .filter(
          message => message.role === 'user' || message.role === 'assistant',
        )
        .slice(-8)
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  const scrollToBottom = () => {
    if (!messageContainerRef.current) {
      return;
    }

    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;
  };

  const sendMessage = async (message: string) => {
    const userMessage: TChatMessage = {
      id: createId(),
      role: 'user',
      content: message,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    window.setTimeout(scrollToBottom, 0);

    try {
      const response = await platformServices.chatWithAssistant({
        message,
        history: historyPayload,
      });
      const reply = getReplyText(response.data);

      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content:
            reply ||
            'I could not generate a response right now. Please try again in a moment.',
        },
      ]);
    } catch (error) {
      console.error('Chatbot request failed:', error);

      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content:
            'Something went wrong while contacting the assistant. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
      window.setTimeout(scrollToBottom, 0);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSend) {
      return;
    }

    await sendMessage(trimmedInput);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isSending) {
      return;
    }

    await sendMessage(suggestion);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-5 sm:left-auto sm:right-5">
      {isOpen ? (
        <section className="flex h-[75vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:h-140 sm:w-95">
          <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">Planora Assistant</p>
                <p className="text-xs text-primary-foreground/80">
                  Event ideas and instant help
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div
            ref={messageContainerRef}
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map(message => (
              <div
                key={message.id}
                className={
                  message.role === 'user'
                    ? 'flex justify-end'
                    : 'flex justify-start'
                }
              >
                <p
                  className={
                    message.role === 'user'
                      ? 'max-w-[88%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground'
                      : 'max-w-[88%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground'
                  }
                >
                  {message.content}
                </p>
              </div>
            ))}
            {isSending ? (
              <div className="flex justify-start">
                <p className="max-w-[88%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground">
                  Thinking...
                </p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <Textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Ask for event ideas, planning tips, or anything else..."
                rows={3}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();

                    if (canSend) {
                      void sendMessage(trimmedInput);
                    }
                  }
                }}
              />
              <Button type="submit" className="w-full" disabled={!canSend}>
                <Send className="mr-2 h-4 w-4" />
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </section>
      ) : null}

      {!isOpen ? (
        <Button
          type="button"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : null}
    </div>
  );
}
