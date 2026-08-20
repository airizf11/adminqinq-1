// coteadmin/src/lib/constants/order-status.tsx
import { CircleDashed, Loader2, PackageCheck, CheckCircle2, Ban, type LucideIcon } from 'lucide-react';

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  RECEIVED: {
    label: 'Diterima',
    color: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
    icon: CircleDashed,
  },
  IN_PROCESS: {
    label: 'Diproses',
    color: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    icon: Loader2, // sebelumnya WashingMachine — ganti generik
  },
  READY: {
    label: 'Siap Diambil',
    color: 'bg-secondary/20 text-secondary-foreground border-secondary/30 hover:bg-secondary/30',
    icon: PackageCheck,
  },
  DONE: {
    label: 'Selesai',
    color: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Dibatalkan',
    color: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    icon: Ban,
  },
};