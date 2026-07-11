// adminqinq/src/app/(app)/layout.tsx
import Link from 'next/link';
import { Home, ClipboardList, Zap, Users, Menu } from 'lucide-react';

const LEFT_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/orders', label: 'Order', icon: ClipboardList },
];

const RIGHT_ITEMS = [
  { href: '/customers', label: 'Cust', icon: Users },
  { href: '/more', label: 'More', icon: Menu },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20 bg-background text-foreground flex flex-col">
      {/* HEADER ATAS (Sticky) 
        Adopsi dari index.html biar nama brand kelihatan profesional
      */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="font-heading font-bold text-xl text-primary tracking-tight">
            Qinq <span className="text-secondary-foreground">Laundry</span>
          </div>
          {/* Tempat untuk letak Toggle Bahasa nanti */}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* BOTTOM NAVIGATION (Mobile-First) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background flex items-center justify-around px-2 py-2 print:hidden z-50">
        {LEFT_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link 
            key={href} 
            href={href} 
            className="flex flex-col items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}

        {/* TOMBOL INPUT BESAR 
          Kita pakai bg-secondary (Warna Gold) agar kontras dengan warna Navy
        */}
        <Link 
          href="/orders/new" 
          className="flex flex-col items-center -mt-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
        >
          <span className="w-14 h-14 rounded-full bg-primary text-secondary-foreground flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Zap size={24} className="fill-current" />
          </span>
          <span className="text-[10px] text-muted-foreground mt-1 font-medium group-hover:text-primary transition-colors">
            Input
          </span>
        </Link>

        {RIGHT_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link 
            key={href} 
            href={href} 
            className="flex flex-col items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}