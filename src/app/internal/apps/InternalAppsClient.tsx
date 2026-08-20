// coteadmin/src/app/internal/apps/InternalAppsClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClientApp, listMyApps } from './actions';

type CreatedApp = { id: string; name: string; apiKey: string };
type MyApp = { appId: string; appName: string; apiKey: string; role: string; status: string };

export function InternalAppsClient() {
  const [businessName, setBusinessName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<CreatedApp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [myApps, setMyApps] = useState<MyApp[]>([]);
   const [loadingApps, setLoadingApps] = useState(true);

   async function refreshApps() {
     setLoadingApps(true);
     const res = await listMyApps();
     if (res.data) setMyApps(res.data);
     setLoadingApps(false);
   }

   useEffect(() => {
     refreshApps();
   }, []);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    setResult(null);
    setInviteStatus(null);
    const result = await createClientApp(businessName, clientEmail);
     setCreating(false);

     if (result.error) {
       setError(result.error);
       return;
     }
     setResult(result.data!);
     if (result.inviteMessage) setInviteStatus(result.inviteMessage);
     setBusinessName('');
     setClientEmail('');
     refreshApps();
  }

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Buat App Klien Baru</h1>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1">Nama Usaha</label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full h-10 px-3 border rounded-md"
            placeholder="cth: Laundry Berkah Jaya"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email Klien (opsional, buat auto-invite)</label>
          <input
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            type="email"
            className="w-full h-10 px-3 border rounded-md"
            placeholder="klien@gmail.com"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={creating || !businessName}
          className="w-full h-11 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >
          {creating ? 'Membuat...' : 'Buat App'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="p-4 bg-muted rounded-md space-y-2 text-sm">
          <p><strong>Nama App:</strong> {result.name}</p>
          <p><strong>App ID:</strong> <code className="text-xs">{result.id}</code></p>
          <p><strong>API Key:</strong> <code className="text-xs break-all">{result.apiKey}</code></p>
          <p className="text-xs text-muted-foreground pt-2">
            Simpan API Key ini — dipakai untuk konfigurasi environment klien kalau perlu integrasi khusus.
          </p>
        </div>
      )}

      {inviteStatus && <p className="text-sm text-green-700">{inviteStatus}</p>}

      <div className="pt-6 border-t">
         <h2 className="text-lg font-bold mb-3">Semua App Kamu</h2>
         {loadingApps ? (
           <p className="text-sm text-muted-foreground">Memuat...</p>
         ) : myApps.length === 0 ? (
           <p className="text-sm text-muted-foreground">Belum ada app.</p>
         ) : (
           <div className="space-y-2">
             {myApps.map((app) => (
               <div key={app.appId} className="p-3 border rounded-md text-sm">
                 <div className="flex justify-between items-center">
                   <span className="font-semibold">{app.appName}</span>
                   <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{app.role}</span>
                 </div>
                 <code className="text-xs text-muted-foreground break-all block mt-1">{app.apiKey}</code>
               </div>
             ))}
           </div>
         )}
       </div>
    </div>
  );
}