// coteadmin/src/app/(app)/dashboard/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { cotebek } from '@/lib/cotebek';
import { getCurrentUserName, getCurrentUserEmail } from '@/lib/session';
import { Card, CardContent } from '@/components/ui/card';
import { STATUS_CONFIG } from '@/lib/constants/order-status';
import { Wallet, Clock, Users, ArrowRight, ListChecks, BarChart3 } from 'lucide-react';
import { DashboardSkeleton } from './DashboardSkeleton';

type Overview = {
  ordersToday: number;
  revenueToday: number;
  activeOrders: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
};

type StatusBreakdown = Record<string, number>;

type StaffDashboard = {
  windowDays: number;
  totalOrders: number;
  statusBreakdown: StatusBreakdown;
};

const ROLE_LABEL: Record<string, string> = {
  DEV: 'Developer',
  OWNER: 'Pemilik',
  ADMIN: 'Admin',
  STAFF: 'Staf',
};

const ORDER_STATUSES = ['RECEIVED', 'IN_PROCESS', 'READY', 'DONE', 'CANCELLED'];

export default async function DashboardPage() {
  const [name, email, membership] = await Promise.all([
    getCurrentUserName(),
    getCurrentUserEmail(),
    cotebek<{ data: { isMember: boolean; role: string | null } }>('/auth/membership'),
  ]);

  const role = membership.data.role ?? 'STAFF';
  const displayName = name ?? email?.split('@')[0] ?? 'Kak';

  return (
    <div className="p-4 pb-8 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary tracking-tight">
          Halo, {displayName}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {ROLE_LABEL[role] ?? role} — Pantau performa usahamu.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData role={role} />
      </Suspense>
    </div>
  );
}

async function DashboardData({ role }: { role: string }) {
  if (role === 'STAFF') {
    const res = await cotebek<{ data: StaffDashboard }>('/reports/staff-dashboard');
    return <StaffView data={res.data} />;
  }

  const [overviewRes, breakdownRes] = await Promise.all([
    cotebek<{ data: Overview }>('/reports/overview'),
    cotebek<{ data: StatusBreakdown }>('/reports/status-breakdown'),
  ]);

  return <AdminView overview={overviewRes.data} breakdown={breakdownRes.data} />;
}

function StatusGrid({ breakdown }: { breakdown: StatusBreakdown }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ORDER_STATUSES.map((status) => {
        const config = STATUS_CONFIG[status];
        const Icon = config?.icon;
        return (
          <Card key={status} className={`shadow-sm border ${config?.color ?? ''}`}>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-80">{config?.label ?? status}</span>
                {Icon && <Icon size={16} className="opacity-70" />}
              </div>
              <div className="text-xl font-bold">{breakdown[status] ?? 0}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StaffView({ data: s }: { data: StaffDashboard }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
          Status Order — {s.windowDays} hari terakhir
        </h2>
        <StatusGrid breakdown={s.statusBreakdown} />
      </div>

      <Link
        href="/orders"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <Card className="bg-card text-card-foreground border-4 border-primary shadow-sm hover:bg-muted/30 transition-colors group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <ListChecks size={24} className="text-primary group-hover:animate-pulse" />
              </div>
              <div>
                <div className="font-medium">Total Order</div>
                <div className="text-xs text-secondary-foreground/80">{s.windowDays} hari terakhir</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{s.totalOrders}</span>
              <ArrowRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function AdminView({ overview: o, breakdown }: { overview: Overview; breakdown: StatusBreakdown }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
          Status Order — sejak awal
        </h2>
        <StatusGrid breakdown={breakdown} />
      </div>

      <Link
        href="/orders"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <Card className="bg-card text-card-foreground border-4 border-primary shadow-sm hover:bg-muted/30 transition-colors group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock size={24} className="text-primary group-hover:animate-pulse" />
              </div>
              <div>
                <div className="font-medium">Order Berjalan</div>
                <div className="text-xs text-secondary-foreground/80">Butuh diselesaikan</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{o.activeOrders}</span>
              <ArrowRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">Ringkasan Bisnis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Omzet Hari Ini</span>
              <span className="text-lg font-bold text-success">
                Rp{o.revenueToday.toLocaleString('id-ID')}
              </span>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Order Hari Ini</span>
              <span className="text-xl font-semibold text-foreground">{o.ordersToday}</span>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Total Order (sejak awal)</span>
              <span className="text-xl font-semibold text-foreground">{o.totalOrders}</span>
            </CardContent>
          </Card>
          <Link href="/customers" className="block">
            <Card className="shadow-sm hover:border-primary transition-colors cursor-pointer group h-full">
              <CardContent className="p-4 flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Total Pelanggan
                </span>
                <span className="text-xl font-semibold text-foreground">{o.totalCustomers}</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Link
        href="/reports"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <Card className="shadow-sm hover:border-primary transition-colors cursor-pointer group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <BarChart3 size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div className="font-medium">Laporan Lengkap</div>
                <div className="text-xs text-muted-foreground">Lihat analisis & export data</div>
              </div>
            </div>
            <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <div className="text-right">
        <span className="text-xs text-muted-foreground">Total Omzet Sejak Awal: </span>
        <span className="text-sm font-bold text-success">Rp{o.totalRevenue.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}