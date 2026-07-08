// adminqinq/src/app/(app)/orders/new/CustomerPicker.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { searchCustomersByPhone, createQuickCustomer, type CustomerMatch } from './customer-actions';

export function CustomerPicker({ onSelect }: { onSelect: (customer: CustomerMatch | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CustomerMatch[]>([]);
  const [selected, setSelected] = useState<CustomerMatch | null>(null);
  const [creating, setCreating] = useState(false);
  const [noPhoneMode, setNoPhoneMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selected) return;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const matches = await searchCustomersByPhone(query);
        setResults(matches);
      });
    }, 550);
    return () => clearTimeout(timer);
  }, [query, selected]);

  function handleSelect(customer: CustomerMatch) {
    setSelected(customer);
    setResults([]);
    onSelect(customer);
  }

  function handleClear() {
    setSelected(null);
    setQuery('');
    setNewName('');
    setCreating(false);
    onSelect(null);
  }

  async function handleCreateQuick() {
    setError(null);
    if (!newName.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    const result = await createQuickCustomer(newName.trim(), query.trim());
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.customer) handleSelect(result.customer);
  }

  if (selected) {
    return (
      <div className="border rounded-lg p-3 flex justify-between items-center">
        <div>
          <div className="font-medium text-sm">{selected.name}</div>
          <div className="text-xs text-gray-500">{selected.phone}</div>
        </div>
        <button onClick={handleClear} className="text-xs text-red-500">Ganti</button>
      </div>
    );
  }

  if (noPhoneMode) {
   return (
     <div>
       <label className="text-sm text-gray-600 block mb-1">Nama Customer (tanpa HP)</label>
       <input
         value={newName}
         onChange={(e) => setNewName(e.target.value)}
         placeholder="Nama customer"
         className="w-full border rounded-lg p-2.5"
       />
       {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
       <div className="flex gap-2 mt-2">
         <button onClick={() => { setNoPhoneMode(false); setNewName(''); setError(null); }} className="flex-1 border rounded-lg p-2 text-sm">
           Batal
         </button>
         <button
           onClick={async () => {
             if (!newName.trim()) { setError('Nama wajib diisi.'); return; }
             const result = await createQuickCustomer(newName.trim());
             if (result?.error) setError(result.error);
             else if (result?.customer) { handleSelect(result.customer); setNoPhoneMode(false); }
           }}
           className="flex-1 bg-black text-white rounded-lg p-2 text-sm"
         >
           Simpan & Pilih
         </button>
       </div>
     </div>
   );
 }

  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">Customer (opsional)</label>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setCreating(false); }}
        placeholder="Cari nama atau no. HP..."
        className="w-full border rounded-lg p-2.5"
      />

      {isPending && <p className="text-xs text-gray-400 mt-1">Mencari...</p>}

      {!isPending && query.length >= 3 && results.length > 0 && (
        <ul className="border rounded-lg mt-1 divide-y">
          {results.map((c) => (
            <li key={c.id}>
              <button onClick={() => handleSelect(c)} className="w-full text-left p-2.5 active:bg-gray-50">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.phone}</div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isPending && query.length >= 3 && results.length === 0 && !creating && (
        <button onClick={() => setCreating(true)} className="text-sm text-blue-600 mt-2">
          + Customer baru dengan HP ini
        </button>
      )}

      {creating && (
        <div className="border rounded-lg p-3 mt-2 space-y-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama customer"
            className="w-full border rounded-lg p-2.5"
          />
          <p className="text-xs text-gray-500">No. HP: {query}</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button onClick={handleCreateQuick} className="w-full bg-black text-white rounded-lg p-2 text-sm">
            Simpan & Pilih
          </button>
        </div>
      )}
      <button onClick={() => setNoPhoneMode(true)} className="text-xs text-gray-500 mt-2 underline">
+       Pelanggan tidak punya HP?
+     </button>
    </div>
  );
}