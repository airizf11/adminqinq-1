// coteadmin/src/app/(app)/dashboard/DashboardSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-6 w-12 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-20 bg-muted rounded-xl" />
    </div>
  );
}