"use client";
import { useState } from 'react';

export default function CreditoPage() {
  const [valor, setValor] = useState(5000);
  const [plano, setPlano] = useState('insumos');

  return (
    <div className="grid gap-6 max-w-xl w-full">
      <h2 className="text-2xl font-bold">Crédito Solidário</h2>
      <div className="rounded-xl p-5 border bg-white grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Valor desejado (MBC)</span>
          <input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Plano de uso</span>
          <select value={plano} onChange={(e) => setPlano(e.target.value)} className="border rounded px-3 py-2">
            <option value="insumos">Compra de insumos</option>
            <option value="giro">Capital de giro</option>
            <option value="equipamentos">Equipamentos</option>
          </select>
        </label>
        <div className="text-sm text-gray-600">Simulação: parcelas em 6x sem juros • Retorno social esperado: feira local</div>
        <button className="bg-red-600 text-white rounded px-4 py-2 w-full">Solicitar crédito</button>
      </div>
    </div>
  );
} 