// adminqinq/src/app/login/page.tsx
'use client';

import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from './actions';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-xl font-semibold mb-1">Halo, Admin dari Qinq Laundry!</h1>
      <p className="text-sm text-gray-500 mb-8">Masuk buat lanjut kerja</p>

      <GoogleLogin
        onSuccess={async (credResp) => {
          if (!credResp.credential) return;
          const result = await googleLogin(credResp.credential);
          if (result?.error) setError(result.error);
        }}
        onError={() => setError('Login Google gagal, coba lagi.')}
      />

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </div>
  );
}