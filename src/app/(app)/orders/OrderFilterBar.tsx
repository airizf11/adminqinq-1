// coteadmin/src/app/(app)/orders/OrderFilterBar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants/order-status';

const ORDER_STATUSES = ['RECEIVED', 'IN_PROCESS', 'READY', 'DONE', 'CANCELLED'];

export function OrderFilterBar({
  currentStatus,
  currentPaymentStatus,
}: {
  currentStatus?: string;
  currentPaymentStatus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeCount = (currentStatus ? 1 : 0) + (currentPaymentStatus ? 1 : 0);

  function updateFilter(key: 'status' | 'paymentStatus', value: string | null) {
    const params = new URLSearchParams();
    if (key === 'status') {
      if (value) params.set('status', value);
      if (currentPaymentStatus) params.set('paymentStatus', currentPaymentStatus);
    } else {
      if (currentStatus) params.set('status', currentStatus);
      if (value) params.set('paymentStatus', value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <SlidersHorizontal size={16} />
        Filter
        {activeCount > 0 && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-full">
            {activeCount}
          </Badge>
        )}
      </button>

      {open && (
        <div className="space-y-3 p-3 bg-muted/30 rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Status Order</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('status', null)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  !currentStatus
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                )}
              >
                Semua
              </button>
              {ORDER_STATUSES.map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <button
                    key={status}
                    onClick={() => updateFilter('status', status)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                      currentStatus === status
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                    )}
                  >
                    {config?.label ?? status}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Status Bayar</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('paymentStatus', null)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  !currentPaymentStatus
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 cursor-pointer',
                )}
              >
                Semua
              </button>
              <button
                onClick={() => updateFilter('paymentStatus', 'PAID')}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  currentPaymentStatus === 'PAID'
                    ? 'bg-success text-white border-success'
                    : 'bg-background text-muted-foreground border-border hover:border-success/40 cursor-pointer',
                )}
              >
                Lunas
              </button>
              <button
                onClick={() => updateFilter('paymentStatus', 'UNPAID')}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                  currentPaymentStatus === 'UNPAID'
                    ? 'bg-destructive text-white border-destructive'
                    : 'bg-background text-muted-foreground border-border hover:border-destructive/40 cursor-pointer',
                )}
              >
                Belum Lunas
              </button>
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-xs text-destructive font-medium cursor-pointer"
            >
              <X size={12} /> Hapus semua filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}