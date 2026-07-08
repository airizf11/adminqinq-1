// adminqinq/src/app/(app)/orders/[id]/receipt/PrintButton.tsx
'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full max-w-[320px] mx-auto block bg-black text-white rounded-lg p-3 font-medium mb-4 print:hidden"
    >
      Cetak Struk
    </button>
  );
}