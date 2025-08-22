import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="rounded-xl brand-bg text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold">Mumbuca Pro</h1>
          <p className="mt-2 text-white/90">Crédito + Produção + Venda em Maricá</p>
          <div className="mt-6 flex gap-3">
            <Link href="/login" className="btn-primary bg-white text-red-700">Entrar</Link>
            <Link href="/dashboard" className="btn-outline border-white text-white">Explorar</Link>
          </div>
        </div>
        <Image src="/mumbuca.jpeg" alt="Mumbuca Pro" width={140} height={140} className="rounded shadow-lg" />
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/credito", title: "Crédito Solidário", desc: "Simule e solicite crédito em Mumbuca" },
          { href: "/producao", title: "Produção Coletiva", desc: "Tarefas, metas e recursos" },
          { href: "/vendas", title: "Vendas Locais", desc: "Produtos, estoque e pedidos" },
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
