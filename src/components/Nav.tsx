"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useUserRole, type UserRole } from '@/lib/role';
import { useState } from 'react';

type NavItem = { href: string; label: string; roles: UserRole[] };

const allNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['consumidor','empreendedor','cooperativa'] },
  { href: '/credito', label: 'Crédito', roles: ['empreendedor','cooperativa'] },
  { href: '/producao', label: 'Produção', roles: ['cooperativa'] },
  { href: '/pedidos', label: 'Pedidos', roles: ['empreendedor','cooperativa'] },
  { href: '/vendas', label: 'Vendas', roles: ['consumidor','empreendedor','cooperativa'] },
  { href: '/relatorios', label: 'Relatórios', roles: ['empreendedor','cooperativa'] },
  { href: '/perfil', label: 'Perfil', roles: ['consumidor','empreendedor','cooperativa'] },
  { href: '/login', label: 'Entrar', roles: ['consumidor','empreendedor','cooperativa'] },
];

export default function Nav() {
  const { role } = useUserRole();
  const [open, setOpen] = useState(false);
  const items = allNavItems.filter((i) => i.roles.includes(role));

  return (
    <header className="brand-bg text-white sticky top-0 z-30">
      <div className="w-full max-w-full mx-auto px-4 py-3 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/mumbuca.jpeg" alt="Mumbuca Pro" width={28} height={28} className="rounded" />
          Mumbuca Pro
        </Link>
        <button className="sm:hidden px-2 py-1 rounded hover:bg-white/10" onClick={() => setOpen(v => !v)}>Menu</button>
        <nav className={`gap-2 text-sm ${open ? 'flex flex-col absolute right-4 top-12 bg-[var(--brand-red)]/95 rounded p-2 shadow' : 'hidden'} sm:flex sm:static sm:bg-transparent sm:flex-row sm:p-0`}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="px-2 py-1 rounded hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
} 