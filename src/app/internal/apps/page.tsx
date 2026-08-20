// coteadmin/src/app/internal/apps/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InternalAppsClient } from './InternalAppsClient';

export default async function InternalAppsPage() {
  const store = await cookies();
  const authed = store.get('internal_gate')?.value === process.env.INTERNAL_GATE_SECRET;

  if (!authed) {
    redirect('/internal/apps/gate');
  }

  return <InternalAppsClient />;
}