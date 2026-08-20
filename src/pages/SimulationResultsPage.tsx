import { CalendarClock, Goal, PiggyBank } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { AIInsightsCard } from '@/components/features/SimulationResults/AIInsightCardProps'
import { Card } from '@/components/features/SimulationResults/Card'
import { FinancialSummaryCard } from '@/components/features/SimulationResults/FinancialSummaryCard'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { getFormData } = useSimulationStorage()

  const data = id ? getFormData(id) : null

  if (!data) {
    return <p>Simulação não encontrada.</p>
  }

  const monthlySavings = calcMonthlySavings(data)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos."
      />
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={`R$ ${data.goalAmount}`}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle={'Prazo para atingir a meta'}
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={'Economia mensal necessária'}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AIInsightsCard simulationId={data.id} goalName={data.goalName} />
        <FinancialSummaryCard
          className="order-1 lg:order-2"
          income={`R$ ${data.income}`}
          expenses={`R$ ${data.expenses}`}
          debts={`R$ ${data.debts}`}
        />
      </div>
    </main>
  )
}
