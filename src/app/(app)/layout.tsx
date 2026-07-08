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
    <div className="min-h-screen pb-20">
      <main>{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white flex items-center justify-around px-2 py-2">
        {LEFT_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1 text-xs text-gray-600">
            <Icon size={20} />
            {label}
          </Link>
        ))}

        <Link href="/orders/new" className="flex flex-col items-center -mt-6">
          <span className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
            <Zap size={24} />
          </span>
          <span className="text-[10px] text-gray-600 mt-1">Input</span>
        </Link>

        {RIGHT_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1 text-xs text-gray-600">
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}