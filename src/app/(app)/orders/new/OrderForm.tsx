// adminqinq/src/app/(app)/orders/new/OrderForm.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { createOrder } from '../actions';
import { CustomerMatch } from './customer-actions';
import { CustomerPicker } from './CustomerPicker';
import { checkPromo, PromoCheckResult } from './promo-actions';

type Item = { id: string; name: string; price: number; cogs: number };
type CartLine = { itemId: string; itemName: string; qty: number; price: number; cogs: number };
type PromoOption = { id: string; name: string; code: string; type: 'PERCENTAGE' | 'NOMINAL'; value: number };

const PAYMENT_METHODS = ['Tunai', 'Transfer Bank', 'QRIS', 'E-Wallet'];

export function OrderForm({ items, promos }: { items: Item[]; promos: PromoOption[] }) {
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [customer, setCustomer] = useState<CustomerMatch | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [selectedPromoId, setSelectedPromoId] = useState('');
 const [appliedPromo, setAppliedPromo] = useState<PromoCheckResult | null>(null);
 const [promoError, setPromoError] = useState<string | null>(null);
 const [promoChecking, setPromoChecking] = useState(false);

  function addItem(item: Item) {
    setCart((prev) => {
      const qty = (prev[item.id]?.qty ?? 0) + 1;
      return {
        ...prev,
        [item.id]: { itemId: item.id, itemName: item.name, qty, price: item.price, cogs: item.cogs },
      };
    });
  }

  function changeQty(itemId: string, delta: number) {
    setCart((prev) => {
      const line = prev[itemId];
      if (!line) return prev;
      const qty = line.qty + delta;
      if (qty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: { ...line, qty } };
    });
  }

  const cartLines = Object.values(cart);
  const totalAmount = useMemo(() => cartLines.reduce((sum, l) => sum + l.price * l.qty, 0), [cartLines]);

  // Keranjang berubah setelah promo diterapkan → batalkan, biar staff cek ulang (diskon bisa beda)
 // Auto-cek ulang tiap kali: promo dipilih/diganti, keranjang berubah, atau customer berubah
 useEffect(() => {
   if (!selectedPromoId) {
     setAppliedPromo(null);
     return;
   }
   const promo = promos.find((p) => p.id === selectedPromoId);
   if (!promo) return;

   let cancelled = false;
   setPromoChecking(true);
  setPromoError(null);

   checkPromo(promo.code, totalAmount, customer?.id).then((result) => {
     if (cancelled) return;
     setPromoChecking(false);
     if (result.error) {
       setPromoError(result.error);
       setAppliedPromo(null);
     } else if (result.promo) {
       setAppliedPromo(result.promo);
     }
   });

   return () => { cancelled = true; };
 }, [selectedPromoId, totalAmount, customer?.id, promos]);

 const finalAmount = appliedPromo ? appliedPromo.finalAmount : totalAmount;

  async function handleSubmit() {
    if (cartLines.length === 0) {
      setError('Pilih minimal 1 layanan dulu.');
      return;
    }
    setError(null);
    setPending(true);

    const selectedPromo = promos.find((p) => p.id === selectedPromoId);
    const result = await createOrder({
      items: cartLines.map((l) => ({
        itemId: l.itemId,
        itemName: l.itemName,
        qty: l.qty,
        price: l.price,
        cogs: l.cogs,
        subtotal: l.price * l.qty,
      })),
      paymentMethod,
      dueDate: dueDate || undefined,
      customerId: customer?.id,
      promoCode: appliedPromo && selectedPromo ? selectedPromo.code : undefined,
    });

    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="space-y-4">
      <CustomerPicker onSelect={setCustomer} />
      <div>
        <h2 className="text-sm font-medium text-gray-600 mb-2">Pilih Layanan</h2>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className="border rounded-lg p-3 text-left active:bg-gray-100"
            >
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-500">Rp{item.price.toLocaleString('id-ID')}</div>
            </button>
          ))}
        </div>
      </div>

      {cartLines.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">Keranjang</h2>
          <ul className="space-y-2">
            {cartLines.map((line) => (
              <li key={line.itemId} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{line.itemName}</div>
                  <div className="text-xs text-gray-500">Rp{line.price.toLocaleString('id-ID')} / item</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => changeQty(line.itemId, -1)} className="w-7 h-7 border rounded-full">−</button>
                  <span className="w-5 text-center text-sm">{line.qty}</span>
                  <button onClick={() => changeQty(line.itemId, 1)} className="w-7 h-7 border rounded-full">+</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cartLines.length > 0 && promos.length > 0 && (
   <div>
     <label className="text-sm text-gray-600 block mb-1">Promo (opsional)</label>
     <select
       value={selectedPromoId}
       onChange={(e) => setSelectedPromoId(e.target.value)}
       className="w-full border rounded-lg p-2.5"
     >
       <option value="">Tanpa promo</option>
       {promos.map((p) => (
         <option key={p.id} value={p.id}>
           {p.name} ({p.type === 'PERCENTAGE' ? `${p.value}%` : `Rp${p.value.toLocaleString('id-ID')}`})
         </option>
      ))}
     </select>
     {promoChecking && <p className="text-xs text-gray-400 mt-1">Mengecek promo...</p>}
     {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
     {appliedPromo && !promoChecking && (
       <p className="text-xs text-green-600 mt-1">Hemat Rp{appliedPromo.discountAmount.toLocaleString('id-ID')}</p>
     )}
   </div>
 )}

      <div>
        <label className="text-sm text-gray-600 block mb-1">Metode Bayar</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border rounded-lg p-2.5">
          {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Estimasi Selesai (opsional)</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border rounded-lg p-2.5" />
      </div>

      <div className="border-t pt-3 space-y-1">
   <div className="flex justify-between text-sm">
     <span className="text-gray-500">Subtotal</span>
     <span>Rp{totalAmount.toLocaleString('id-ID')}</span>
   </div>
   {appliedPromo && (
     <div className="flex justify-between text-sm text-green-600">
       <span>Diskon</span>
       <span>-Rp{appliedPromo.discountAmount.toLocaleString('id-ID')}</span>
     </div>
   )}
   <div className="flex justify-between items-center pt-1">
     <span className="text-sm text-gray-600">Total</span>
     <span className="text-lg font-semibold">Rp{finalAmount.toLocaleString('id-ID')}</span>
   </div>
 </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={pending || cartLines.length === 0}
        className="w-full bg-black text-white rounded-lg p-3 font-medium disabled:opacity-50"
      >
        {pending ? 'Menyimpan...' : 'Buat Order'}
      </button>
    </div>
  );
}