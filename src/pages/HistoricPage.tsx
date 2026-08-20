import { useNavigate } from 'react-router-dom'

import { HistoricListItem } from '@/components/features/Historic/ListItem'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { useState } from 'react'

export function HistoricPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()

  const [simulations, setSimulations] = useState(() => getAllSimulations())

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) => current.filter((record) => record.id !== id))
  }

  const handleViewDetails = (id: string) => {
    void navigate(`/resultado/${id}`)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />
      {simulations.length === 0 ? (
        <p className="text-muted-foreground">
          Você ainda não fez nenhuma simulação.
        </p>
      ) : (
        <div className="mb-6 grid gap-4">
          {simulations.map((simulation) => (
            <HistoricListItem
              key={simulation.id}
              simulation={simulation}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </main>
  )
}
