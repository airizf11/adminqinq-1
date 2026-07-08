// adminqinq/src/app/devtest/apikeys/page.tsx
import { cotebek } from '@/lib/cotebek';
import { CreateAppForm } from './CreateAppForm';

export default async function DevTestApiKeysPage() {
  try {
    const res = await cotebek('/users/me/apps');
    return (
      <div className="p-4">
       <CreateAppForm />
       <pre className="p-4 text-xs overflow-auto bg-gray-100 rounded-lg">
         {JSON.stringify(res, null, 2)}
       </pre>
     </div>
    );
  } catch (e) {
    return (
      <pre className="p-4 text-xs text-red-500">
        Error: {e instanceof Error ? e.message : 'Unknown error'}
      </pre>
    );
  }
}