// adminqinq/src/app/track/page.tsx
import { redirect } from 'next/navigation';

export default async function TrackSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  if (params.order) {
    redirect(`/track/${params.order.trim().toUpperCase()}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-xl font-semibold mb-1">Cek Status Cucian</h1>
      <p className="text-sm text-gray-500 mb-8">Masukkan nomor order dari struk kamu</p>

      <form method="GET" className="w-full max-w-sm space-y-3">
        <input
          name="order"
          required
          placeholder="ORD-20260708-0001"
          className="w-full border rounded-lg p-3 text-center uppercase"
        />
        <button type="submit" className="w-full bg-black text-white rounded-lg p-3 font-medium">
          Cek Status
        </button>
      </form>
    </div>
  );
}