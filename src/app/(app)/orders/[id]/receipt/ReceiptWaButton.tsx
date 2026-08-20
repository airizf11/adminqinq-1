// coteadmin/src/app/(app)/orders/[id]/receipt/ReceiptWaButton.tsx
'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { buildReceiptMessage } from '@/lib/wa-templates/receipt';
import type { ReceiptData } from './page';

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function ReceiptWaButton({ data, customerPhone }: { data: ReceiptData; customerPhone: string | null }) {
  if (!customerPhone) return null;

  const message = buildReceiptMessage({
    business: data.business,
    order: data.order,
    customer: data.customer,
    items: data.items,
    summary: data.summary,
  });

  return (
    <a
      href={waLink(customerPhone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "default" }),
        "w-full max-w-[320px] mx-auto mb-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white print:hidden"
      )}
    >
      <MessageCircle size={18} />
      Kirim Struk via WhatsApp
    </a>
  );
}