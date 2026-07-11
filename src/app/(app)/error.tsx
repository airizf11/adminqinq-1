// adminqinq/src/app/(app)/error.tsx
'use client';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isRateLimit = error.message.toLowerCase().includes('too many') || error.message.includes('429');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-gray-600 mb-1">
        {isRateLimit ? 'Kebanyakan request dalam waktu singkat.' : 'Ada yang gak beres.'}
      </p>
      <p className="text-xs text-gray-400 mb-6">
        {isRateLimit ? 'Tunggu sebentar, terus coba lagi.' : error.message}
      </p>
      <button onClick={() => reset()} className="bg-black text-white rounded-lg px-4 py-2 text-sm font-medium">
        Coba Lagi
      </button>
    </div>
  );
}