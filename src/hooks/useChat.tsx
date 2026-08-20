import { useState } from 'react'

import type { ChatMessageProps } from '@/components/features/Insights/ChatMessage'
import { buildChatSystemInstruction } from '@/data/aiPrompt'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getChatAnswer } from '@/services/aiService'

export const useChat = (simulationId: string) => {
  const { getFormData } = useSimulationStorage()

  const [messages, setMessages] = useState<ChatMessageProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (question: string) => {
    const simulation = getFormData(simulationId)

    if (!simulation) {
      setError('Simulação não encontrada.')
      return
    }

    setMessages((current) => [
      ...current,
      { type: 'userQuestion', message: question },
    ])
    setIsLoading(true)
    setError(null)

    try {
      const systemInstruction = buildChatSystemInstruction(simulation)
      const answer = await getChatAnswer(question, systemInstruction)
      setMessages((current) => [
        ...current,
        { type: 'aiAnswer', message: answer },
      ])
    } catch {
      setError('Erro ao gerar a resposta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, error, sendMessage }
}
