// adminqinq/src/app/(app)/more/page.tsx
import Link from 'next/link';
import { Package, Receipt, Tag, BarChart3, UserCircle, Settings, ClipboardList } from 'lucide-react';

const MENU = [
  { href: '/items', label: 'Item', icon: Package, ready: true },
  { href: '/promos', label: 'Promo', icon: Tag, ready: true },
  { href: '/transactions', label: 'Transaksi', icon: Receipt, ready: true },
  { href: '/reports', label: 'Laporan', icon: BarChart3, ready: true },
  { href: '/audit-logs', label: 'Log Audit', icon: ClipboardList, ready: true },
  { href: '/settings', label: 'Pengaturan', icon: Settings, ready: true },
  { href: '/profile', label: 'Profil', icon: UserCircle, ready: true },
];

export default function MorePage() {
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Menu Lainnya</h1>
      <ul className="space-y-2">
        {MENU.map(({ href, label, icon: Icon, ready }) =>
          ready ? (
            <Link key={href} href={href} className="flex items-center gap-3 border rounded-lg p-3">
              <Icon size={20} className="text-gray-600" />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ) : (
            <div key={href} className="flex items-center gap-3 border rounded-lg p-3 opacity-40">
              <Icon size={20} className="text-gray-600" />
              <span className="font-medium text-sm">{label}</span>
              <span className="ml-auto text-xs text-gray-400">Segera</span>
            </div>
          ),
        )}
      </ul>
    </div>
  );
}