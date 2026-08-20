// coteadmin/src/lib/wa-templates/receipt.ts
type ReceiptWaParams = {
  business: {
    name: string;
    address: string | null;
    phone: string | null;
    footer: string;
  };
  order: {
    orderNumber: string;
    trackingToken: string | null;
    paymentMethod: string;
    paymentStatus: "PAID" | "UNPAID";
    createdAt: string;
    dueDate: string | null;
  };
  customer: { name: string | null };
  items: { itemName: string; qty: number; price: number; subtotal: number }[];
  summary: {
    subtotal: number;
    discountAmount: number;
    promoName: string | null;
    total: number;
  };
};

const rp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

export function buildReceiptMessage(params: ReceiptWaParams): string {
  const trackLink = params.order.trackingToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${params.order.trackingToken}`
    : null;

  const itemLines = params.items.map(
    (i) => `${i.itemName}\n${i.qty} x ${rp(i.price)} = ${rp(i.subtotal)}`,
  );

  return [
    `🧾 *STRUK ELEKTRONIK ${params.business.name}*`,
    "",
    params.customer.name ? `Halo *${params.customer.name}*! 👋` : "Halo! 👋",
    `Berikut struk untuk order *${params.order.orderNumber}*:`,
    "",
    "━━━━━━━━━━━━━━━",
    ...itemLines,
    "━━━━━━━━━━━━━━━",
    "",
    `Subtotal: ${rp(params.summary.subtotal)}`,
    ...(params.summary.discountAmount > 0
      ? [
          `Diskon${params.summary.promoName ? ` (${params.summary.promoName})` : ""}: -${rp(params.summary.discountAmount)}`,
        ]
      : []),
    `*Total: ${rp(params.summary.total)}*`,
    `Bayar: ${params.order.paymentMethod}`,
    `Status: *${params.order.paymentStatus === "PAID" ? "LUNAS ✅" : "BELUM LUNAS ⚠️"}*`,
    "",
    ...(trackLink ? [`Lacak status order:`, trackLink, ""] : []),
    params.business.footer,
  ].join("\n");
}
