// adminqinq/src/app/devtest/audit-logs/page.tsx
import { cotebek } from '@/lib/cotebek';

type AuditLog = {
  id: string;
  actorType: 'HUMAN' | 'SYSTEM';
  userName: string | null;
  userEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
};

export default async function AuditLogsPage() {
  const res = await cotebek<{ data: AuditLog[] }>('/audit-logs?limit=50');
  const logs = res.data;

  return (
    <div className="p-4 pb-8">
      <h1 className="text-lg font-semibold mb-1">Audit Log</h1>
      <p className="text-xs text-gray-500 mb-4">50 aktivitas terakhir</p>

      {logs.length === 0 && <p className="text-sm text-gray-500">Belum ada aktivitas.</p>}

      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="border rounded-lg p-3 text-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{log.action}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${log.actorType === 'HUMAN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                {log.actorType === 'HUMAN' ? 'MANUSIA' : 'SISTEM'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-1">
              {log.entity}{log.entityId ? ` · ${log.entityId.slice(0, 8)}...` : ''}
            </div>
            <div className="text-xs text-gray-500">
              {log.actorType === 'HUMAN' ? (log.userName ?? log.userEmail ?? 'Pengguna tidak diketahui') : 'Panggilan sistem (apiKey saja)'}
              {' · '}{new Date(log.createdAt).toLocaleString('id-ID')}
              {log.ipAddress ? ` · ${log.ipAddress}` : ''}
            </div>
            {(log.before || log.after) && (
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer">Detail perubahan</summary>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-auto max-h-40">{JSON.stringify(log.before, null, 2)}</pre>
                  <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-auto max-h-40">{JSON.stringify(log.after, null, 2)}</pre>
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}