export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto grid gap-6">
      <h2 className="text-2xl font-bold">Entrar</h2>
      <div className="rounded-xl p-5 border bg-white grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">E-mail</span>
          <input type="email" placeholder="seu@email" className="border rounded px-3 py-2" />
        </label>
        <button className="bg-red-600 text-white rounded px-4 py-2 w-full">Entrar com link mágico</button>
        <div className="text-xs text-gray-600">Ao continuar, você concorda com os termos.</div>
      </div>
    </div>
  );
} 