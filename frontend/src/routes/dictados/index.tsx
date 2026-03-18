import {createFileRoute, Link} from '@tanstack/react-router'

export const Route = createFileRoute('/dictados/')({
  component: RouteComponent,
})

const niveles = ["10","9","8","7","6","5","4","3","準2","2","準1","1"] as const

function RouteComponent() {
  return (
    <div className="mt-4 mx-4 flex flex-col items-center w-full">
        <Link to="/" className="self-start text-primary hover:underline">← Volver a inicio</Link>
      <h1 className="text-2xl font-bold mb-4">Dictados</h1>
        <small className="pb-2 w-1/2 text-center">Las frases y audios utilizadas para los dictados han sido extraidas de varios medios de forma automática, puede darse el caso de que un audio no corresponda exactamente con la frase</small>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {niveles.map(nivel => (
          <Link to="/dictados/$nivel" params={{nivel:nivel.replace("準2","2.5")}} key={nivel} className="flex flex-col items-center text-primary! justify-center p-6 bg-white rounded-lg shadow hover:bg-primary hover:text-white! transition-all">
            <p className="text-xl font-semibold">{nivel}級</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
