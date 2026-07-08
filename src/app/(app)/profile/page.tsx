// adminqinq/src/app/(app)/profile/page.tsx
import { getCurrentUserEmail } from '@/lib/session';
import { logout } from './actions';

export default async function ProfilePage() {
  const email = await getCurrentUserEmail();

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Profil</h1>

      <div className="border rounded-lg p-3 mb-6">
        <div className="text-xs text-gray-500">Login sebagai</div>
        <div className="font-medium">{email ?? 'Tidak diketahui'}</div>
      </div>

      <form action={logout}>
        <button type="submit" className="w-full border border-red-500 text-red-500 rounded-lg p-3 font-medium">
          Keluar
        </button>
      </form>
    </div>
  );
}