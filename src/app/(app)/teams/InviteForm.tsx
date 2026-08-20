// adminqinq/src/app/(app)/teams/InviteForm.tsx
'use client';

import { useState } from 'react';
import { inviteMember } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export function InviteForm({ appId }: { appId: string }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    setPending(true);
    setError(null);
    setSuccess(null);
    const result = await inviteMember(appId, email.trim(), role);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess('Undangan terkirim.');
      setEmail('');
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <CardContent className="p-3 space-y-2">
        <Label>Undang Anggota Baru</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@gmail.com"
        />
        <Select value={role} onValueChange={(value) => setRole((value ?? 'STAFF') as 'STAFF' | 'ADMIN')}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STAFF">Staf</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {success && <p className="text-xs text-success">{success}</p>}
        <Button onClick={handleSubmit} disabled={pending} className="w-full">
          {pending && <Loader2 size={14} className="mr-2 animate-spin" />}
          {pending ? 'Mengirim...' : 'Kirim Undangan'}
        </Button>
      </CardContent>
    </Card>
  );
}