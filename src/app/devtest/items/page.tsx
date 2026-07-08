// adminqinq/src/app/devtest/items/page.tsx
import { cotebek } from '@/lib/cotebek';

export default async function DevTestItemsPage() {
  try {
    const res = await cotebek('/items');
    return (
      <pre className="p-4 text-xs overflow-auto bg-gray-100 rounded-lg">
        {JSON.stringify(res, null, 2)}
      </pre>
    );
  } catch (e) {
    return (
      <pre className="p-4 text-xs text-red-500">
        Error: {e instanceof Error ? e.message : 'Unknown error'}
      </pre>
    );
  }
}