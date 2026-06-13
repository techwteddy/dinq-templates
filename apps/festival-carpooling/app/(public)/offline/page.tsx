export default function OfflinePage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl mb-4">📡</p>
      <h2 className="text-lg font-semibold text-stone-900 mb-2">Sei offline</h2>
      <p className="text-sm text-stone-500">
        L'app ha bisogno di una connessione per mostrarti i passaggi.
        <br />
        Controlla la connessione e riprova.
      </p>
    </div>
  )
}
