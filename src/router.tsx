import { createBrowserRouter } from 'react-router-dom'
import { SimulationFormPage as SimulationForm } from './pages/SimulationFormPage'
import { SimulationResultsPage } from './pages/SimulationResultsPage'
import { RootLayout } from './components/layout/RootLayout'
import { HistoricPage } from './pages/HistoricPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationForm />,
      },
      {
        path: '/resultado/:id',
        element: <SimulationResultsPage />,
      },
      {
        path: '/historico',
        element: <HistoricPage />,
      },
    ],
  },
])
