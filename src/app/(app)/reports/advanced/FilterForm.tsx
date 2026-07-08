// adminqinq/src/app/(app)/reports/advanced/FilterForm.tsx
'use client';

import { useState } from 'react';

export function FilterForm({
  startDate,
  endDate,
  compareStartDate,
  compareEndDate,
}: {
  startDate: string;
  endDate: string;
  compareStartDate?: string;
  compareEndDate?: string;
}) {
  const [showCompare, setShowCompare] = useState(!!compareStartDate);

  return (
    <form method="GET" className="border rounded-lg p-3 mb-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Dari</label>
          <input type="date" name="startDate" defaultValue={startDate} className="w-full border rounded-lg p-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Sampai</label>
          <input type="date" name="endDate" defaultValue={endDate} className="w-full border rounded-lg p-2 text-sm" />
        </div>
      </div>

      {showCompare ? (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-500">Bandingkan dengan</label>
            <button type="button" onClick={() => setShowCompare(false)} className="text-xs text-red-500">
              Hapus perbandingan
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" name="compareStartDate" defaultValue={compareStartDate} className="w-full border rounded-lg p-2 text-sm" />
            <input type="date" name="compareEndDate" defaultValue={compareEndDate} className="w-full border rounded-lg p-2 text-sm" />
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowCompare(true)} className="text-xs text-blue-600">
          + Bandingkan periode lain
        </button>
      )}

      <button type="submit" className="w-full bg-black text-white rounded-lg p-2.5 text-sm font-medium">
        Terapkan
      </button>
    </form>
  );
}