import { CreditCard, Landmark, Wallet } from 'lucide-react'

import { Divider } from '@/components/shared/Divider'

import { Card } from './Card'

interface FinancialSummaryCardProps {
  income: string
  expenses: string
  debts: string
  className?: string
}

export function FinancialSummaryCard({
  income,
  expenses,
  debts,
  className,
}: FinancialSummaryCardProps) {
  return (
    <div
      className={[
        'bg-card rounded-2xl p-6 shadow-[2px_2px_18px_0px_rgba(0,0,0,0.1)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h1 className="text-foreground mb-8 text-2xl font-semibold">
        Resumo das suas finanças
      </h1>

      <Card
        bare
        icon={Wallet}
        label="Renda mensal"
        value={income}
        subtitle="Renda total bruta por mês"
      />
      <Divider spacing={32} />
      <Card
        bare
        icon={CreditCard}
        label="Custos Fixos de Vida"
        value={expenses}
        subtitle="Gastos essenciais por mês"
      />
      <Divider spacing={32} />
      <Card
        bare
        icon={Landmark}
        label="Dívidas / Parcelas"
        value={debts}
        subtitle="Valor comprometido em parcelas/depósito"
      />
    </div>
  )
}
