"use client";
import Link from "next/link";
import Image from "next/image";
import { useUserRole } from "@/lib/role";

export default function DashboardPage() {
  const { role } = useUserRole();

  if (role === "consumidor") {
    const products = [
      { img: "/madioca.jpg", title: "Mandioca", price: 15, category: "Agricultura" },
      { img: "/tilapia.jpg", title: "Tilápia", price: 22, category: "Pescado" },
      { img: "/banana.jpg", title: "Banana", price: 8, category: "Fruta" },
    ];

    return (
      <div className="grid gap-8">
        <section className="rounded-xl brand-bg text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Compre da sua quebrada</h1>
            <p className="mt-2 text-white/90">Vendas locais pagas em Mumbuca</p>
            <div className="mt-6 flex gap-3">
              <Link href="/vendas" className="btn-primary bg-white text-red-700">Ver ofertas</Link>
              <Link href="/perfil" className="btn-outline border-white text-white">Atualizar perfil</Link>
            </div>
          </div>
          <Image src="/mumbuca.jpeg" alt="Mumbuca Pro" width={140} height={140} className="rounded shadow-lg" />
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link key={p.title} href="/vendas" className="card hover:shadow-md">
              <div className="aspect-video rounded bg-gray-100 overflow-hidden relative">
                <Image src={p.img} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
              </div>
              <h3 className="font-semibold mt-3">{p.title}</h3>
              <p className="text-sm text-gray-600">MBC {p.price} • {p.category}</p>
            </Link>
          ))}
        </section>
      </div>
    );
  }

  // Empreendedor ou Cooperativa
  return (
    <div className="grid gap-8">
      <section className="rounded-xl brand-bg text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold">Mumbuca Pro</h1>
          <p className="mt-2 text-white/90">Crédito + Produção + Venda em Maricá</p>
          <div className="mt-6 flex gap-3">
            <Link href="/credito" className="btn-primary bg-white text-red-700">Solicitar crédito</Link>
            <Link href="/producao" className="btn-outline border-white text-white">Ver tarefas</Link>
          </div>
        </div>
        <Image src="/mumbuca.jpeg" alt="Mumbuca Pro" width={140} height={140} className="rounded shadow-lg" />
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/credito", title: "Crédito Solidário", desc: "Simule e solicite crédito em Mumbuca" },
          { href: "/producao", title: "Produção Coletiva", desc: "Tarefas, metas e recursos" },
          { href: "/vendas", title: "Vendas Locais", desc: "Produtos, estoque e pedidos" },
          { href: "/pedidos", title: "Pedidos", desc: "Compras realizadas por clientes" },
          { href: "/relatorios", title: "Indicadores", desc: "Impacto econômico e social" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="card hover:shadow-md">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
} 