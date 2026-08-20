import 'react-loading-skeleton/dist/skeleton.css'

import { useChat } from '@/hooks/useChat'
import { useInsight } from '@/hooks/useInsight'
import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Divider } from '@/components/shared/Divider'

import { ChatInput } from '../Insights/ChatInput'
import { ChatMessage } from '../Insights/ChatMessage'
import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
  simulationId: string
  goalName: string
}

export function AIInsightsCard({ simulationId, goalName }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const {
    messages: chatMessages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
  } = useChat(simulationId)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const previousMessageCountRef = useRef(chatMessages.length)

  useEffect(() => {
    if (chatMessages.length > previousMessageCountRef.current) {
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }

    previousMessageCountRef.current = chatMessages.length
  }, [chatMessages])

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[2px_2px_18px_0px_rgba(0,0,0,0.1)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && insight && !error && (
        <>
          <Content
            insight={insight}
            goalName={goalName}
            ref={scrollContainerRef}
          >
            {chatMessages.length > 0 && <Divider />}
            {chatMessages.map((chatMessage, index) => (
              <div key={index}>
                {index > 0 && <Divider />}
                <ChatMessage
                  type={chatMessage.type}
                  message={chatMessage.message}
                />
              </div>
            ))}
            {isChatLoading && (
              <div>
                {chatMessages.length > 0 && <Divider />}
                <ChatMessage type="aiAnswer" message="" isLoading />
              </div>
            )}
            {!isChatLoading && chatError && (
              <div>
                {chatMessages.length > 0 && <Divider />}
                <p className="text-sm text-red-500">⚠️ {chatError}</p>
              </div>
            )}
          </Content>
          <Divider />
          <ChatInput onSend={sendMessage} disabled={isChatLoading} />
        </>
      )}
    </div>
  )
}
