export default function ProducaoPage() {
  return (
    <div className="grid gap-6 max-w-3xl">
      <h2 className="text-2xl font-bold">Produção Coletiva</h2>
      <div className="grid gap-4">
        {[
          'Produzir 100 unidades',
          'Organizar estoque',
          'Adquirir materia-prima',
        ].map((t) => (
          <div key={t} className="card flex items-center justify-between">
            <div className="font-medium">{t}</div>
            <button className="btn-outline">Ver tarefas</button>
          </div>
        ))}
      </div>
    </div>
  );
} 