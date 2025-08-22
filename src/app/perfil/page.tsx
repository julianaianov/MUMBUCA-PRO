"use client";
import { useUserRole, type UserRole } from '@/lib/role';

export default function PerfilPage() {
  const { role, setRole } = useUserRole();

  return (
    <div className="max-w-2xl grid gap-6">
      <h2 className="text-2xl font-bold">Perfil e Cadastro</h2>
      <form className="rounded-xl p-5 border bg-white grid gap-4" onSubmit={(e) => e.preventDefault()}>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Tipo de perfil</span>
          <select className="border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="consumidor">Consumidor solidário</option>
            <option value="empreendedor">Empreendedor individual</option>
            <option value="cooperativa">Cooperativa / grupo produtivo</option>
          </select>
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Nome completo</span>
            <input className="border rounded px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-700">CPF/CNPJ</span>
            <input className="border rounded px-3 py-2" />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Bairro (Maricá)</span>
          <input className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Categoria de atuação</span>
          <input className="border rounded px-3 py-2" />
        </label>
        <button className="btn-primary w-full">Salvar</button>
      </form>
    </div>
  );
} 