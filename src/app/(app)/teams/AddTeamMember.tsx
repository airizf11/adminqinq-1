// adminqinq/src/app/(app)/teams/AddTeamMemberForm.tsx
'use client';

import { useState } from 'react';
import { addTeamMember } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function AddTeamMemberForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    setPending(true);
    setError(null);
    const result = await addTeamMember(name.trim(), phone.trim() || undefined);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setName('');
      setPhone('');
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <CardContent className="p-3 space-y-2">
        <Label>Tambah Anggota (tanpa akun)</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" />
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No. HP (opsional)" />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button onClick={handleSubmit} disabled={pending} className="w-full">
          {pending && <Loader2 size={14} className="mr-2 animate-spin" />}
          {pending ? 'Menambah...' : 'Tambah'}
        </Button>
        <p className="text-xs text-muted-foreground">Cocok buat pekerja lapangan yang gak perlu login app, cuma buat dicatat namanya di Order/Transaksi.</p>
      </CardContent>
    </Card>
  );
}