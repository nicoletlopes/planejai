import 'react-loading-skeleton/dist/skeleton.css'

import { MessageCircle } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'

export interface ChatMessageProps {
  type: 'userQuestion' | 'aiAnswer'
  message: string
  isLoading?: boolean
}

export function ChatMessage({ type, message, isLoading }: ChatMessageProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <MessageCircle size={18} className="text-primary" />
        <p className="text-foreground text-sm font-semibold">
          {type === 'userQuestion' ? 'Você' : 'Resposta da IA'}
        </p>
      </div>
      {isLoading ? (
        <Skeleton
          count={3.3}
          baseColor="var(--color-skeleton-base)"
          highlightColor="var(--color-skeleton-highlight)"
        />
      ) : (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {message}
        </p>
      )}
    </div>
  )
}
