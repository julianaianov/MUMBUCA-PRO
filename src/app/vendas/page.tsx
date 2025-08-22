import Image from 'next/image';

export default function VendasPage() {
  const products = [
    { img: '/madioca.jpg', title: 'Mandioca', price: 15, category: 'Agricultura' },
    { img: '/tilapia.jpg', title: 'Tilápia', price: 22, category: 'Pescado' },
    { img: '/banana.jpg', title: 'Banana', price: 8, category: 'Fruta' },
  ];

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Venda Local</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.title} className="card">
            <div className="aspect-video rounded bg-gray-100 overflow-hidden relative">
              <Image src={p.img} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
            </div>
            <div className="mt-3 font-semibold">{p.title}</div>
            <div className="text-sm text-gray-600">MBC {p.price} • {p.category}</div>
            <button className="mt-3 w-full btn-primary">Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
} 