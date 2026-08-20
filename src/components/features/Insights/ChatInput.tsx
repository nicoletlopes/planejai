import { Send } from 'lucide-react'
import { type SubmitEvent, useState } from 'react'

import { Button } from '@/components/shared/Button'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message.trim()) {
      return
    }

    onSend(message.trim())
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <div className="bg-input flex-1 rounded-2xl p-2.5 shadow-[2px_2px_18px_0px_rgba(0,0,0,0.2)]">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pergunte algo sobre sua meta..."
          disabled={disabled}
          className="text-foreground placeholder:text-muted-foreground w-full bg-transparent px-1 text-sm outline-none disabled:opacity-60"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        icon={Send}
        iconSize={18}
        aria-label="Enviar pergunta"
        disabled={disabled || !message.trim()}
        className="shrink-0 shadow-[2px_2px_18px_0px_rgba(0,0,0,0.2)]"
      />
    </form>
  )
}
