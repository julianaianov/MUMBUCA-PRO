"use client";
import { useRoleGuard } from "@/lib/role";
import { useMemo, useState } from "react";

type Order = {
  id: string;
  buyer: string;
  total: number;
  status: "placed" | "paid" | "fulfilled" | "cancelled";
  date: string;
  items: { name: string; qty: number }[];
};

const MOCK: Order[] = [
  {
    id: "ORD-001",
    buyer: "Ana Paula",
    total: 120,
    status: "paid",
    date: "2025-08-22",
    items: [
      { name: "Mandioca", qty: 3 },
      { name: "Banana", qty: 5 },
    ],
  },
  {
    id: "ORD-002",
    buyer: "Carlos Souza",
    total: 220,
    status: "placed",
    date: "2025-08-21",
    items: [{ name: "Tilápia", qty: 2 }],
  },
  {
    id: "ORD-003",
    buyer: "Jéssica Lima",
    total: 90,
    status: "fulfilled",
    date: "2025-08-20",
    items: [{ name: "Banana", qty: 10 }],
  },
];

const STATUS_OPTIONS: { key: Order["status"] | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "placed", label: "Aguardando" },
  { key: "paid", label: "Pago" },
  { key: "fulfilled", label: "Entregue" },
  { key: "cancelled", label: "Cancelado" },
];

export default function PedidosPage() {
  const allowed = useRoleGuard(["empreendedor", "cooperativa"]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Order["status"] | "all">("all");

  const filtered = useMemo(() => {
    return MOCK.filter((o) => {
      const matchesText = `${o.id} ${o.buyer}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" ? true : o.status === status;
      return matchesText && matchesStatus;
    });
  }, [query, status]);

  if (!allowed) return null;

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Order["status"] | "all";
    setStatus(val);
  };

  const badgeClass = (s: Order["status"]) => {
    switch (s) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "fulfilled":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="grid gap-6 w-full">
      <h2 className="text-2xl font-bold">Pedidos</h2>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full">
        <input
          className="border rounded px-3 py-2 w-full sm:w-64"
          placeholder="Buscar por cliente ou ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="border rounded px-3 py-2 w-full sm:w-48" value={status} onChange={onStatusChange}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {filtered.map((o) => (
          <div key={o.id} className="card">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{o.id}</div>
              <span className={`text-xs px-2 py-1 rounded ${badgeClass(o.status)}`}>{STATUS_OPTIONS.find(s => s.key === o.status)?.label}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{new Date(o.date).toLocaleDateString()}</div>
            <div className="mt-3">
              <div className="text-sm"><span className="text-gray-600">Cliente:</span> {o.buyer}</div>
              <div className="text-sm text-gray-600">Itens:</div>
              <ul className="list-disc pl-5 text-sm text-gray-800">
                {o.items.map((it, idx) => (
                  <li key={idx}>{it.name} × {it.qty}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 font-semibold">Total: MBC {o.total}</div>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline">Detalhes</button>
              {o.status === "placed" && <button className="btn-primary">Confirmar pagamento</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 