import { ExternalLink, Goal, Trash2 } from 'lucide-react'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import type { SimulationRecord } from '@/data/simulation'
import { calcMonthlySavings } from '@/utils/simulation'

interface HistoricListItemProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
  onViewDetails: (id: string) => void
}

export function HistoricListItem({
  simulation,
  onDelete,
  onViewDetails,
}: HistoricListItemProps) {
  const monthlySavings = calcMonthlySavings(simulation)
  const formattedDate = new Date(simulation.createdAt).toLocaleDateString(
    'pt-BR',
  )

  return (
    <div className="bg-card flex flex-col gap-4 rounded-2xl p-6 shadow-[2px_2px_18px_0px_rgba(0,0,0,0.1)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
        <div className="bg-muted-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Goal size={24} className="text-primary" />
        </div>
        <div>
          <p className="text-foreground font-semibold">{simulation.goalName}</p>
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 sm:grid sm:flex-1 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Custo da meta
          </p>
          <p className="text-foreground font-semibold">
            R$ {simulation.goalAmount}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Prazo
          </p>
          <p className="text-foreground font-semibold">
            {simulation.goalDeadline} meses
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Economia mensal
          </p>
          <p className="text-foreground font-semibold">
            R${' '}
            {monthlySavings.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:shrink-0">
        <Divider orientation="vertical" className="hidden sm:block" />
        <Button
          variant="ghost"
          icon={Trash2}
          iconStrokeWidth={2}
          aria-label="Excluir simulação"
          className="text-red-500"
          onClick={() => onDelete(simulation.id)}
        />
        <Button
          variant="secondary"
          icon={ExternalLink}
          iconSize={16}
          iconStrokeWidth={2}
          className="py-2!"
          onClick={() => onViewDetails(simulation.id)}
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}
