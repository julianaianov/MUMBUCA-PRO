export default function RelatoriosPage() {
  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Relatórios e Indicadores</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Impacto Econômico', value: 'MBC 5.000' },
          { title: 'Vendas do Mês', value: 'MBC 2.340' },
          { title: 'Tarefas Concluídas', value: '12' },
        ].map((k) => (
          <div key={k.title} className="rounded-xl p-5 border bg-white">
            <div className="text-sm text-gray-600">{k.title}</div>
            <div className="text-2xl font-bold mt-2">{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 