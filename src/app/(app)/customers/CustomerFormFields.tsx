// coteadmin/src/app/(app)/customers/CustomerFormFields.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type CustomerFieldValues = {
  name?: string;
  phone?: string;
  email?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  addressDetail?: string | null;
  village?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  notes?: string | null;
  tags?: string[] | null;
};

export function CustomerFormFields({ defaultValues }: { defaultValues?: CustomerFieldValues }) {
  const [gender, setGender] = useState(defaultValues?.gender ?? '');

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nama *</Label>
        <Input id="name" name="name" required minLength={2} maxLength={100} defaultValue={defaultValues?.name} placeholder="Cth: Budi Santoso" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">No. HP</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={defaultValues?.phone} placeholder="Cth: 08123456789" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ''} placeholder="Cth: budi@email.com" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Jenis Kelamin</Label>
          <input type="hidden" name="gender" value={gender} />
          <Select value={gender} onValueChange={(value) => setGender(value ?? '')}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Laki-laki</SelectItem>
              <SelectItem value="FEMALE">Perempuan</SelectItem>
              <SelectItem value="OTHER">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Tgl Lahir</Label>
          <Input id="birthDate" name="birthDate" type="date" defaultValue={defaultValues?.birthDate ?? ''} />
        </div>
      </div>

      <hr className="border-border" />
      <h2 className="text-sm font-medium text-muted-foreground">Alamat {defaultValues ? '' : '(opsional)'}</h2>

      <div className="space-y-2">
        <Label htmlFor="addressDetail">Detail Alamat</Label>
        <Input id="addressDetail" name="addressDetail" maxLength={255} defaultValue={defaultValues?.addressDetail ?? ''} placeholder="Cth: Jl. Merdeka No. 10, RT 02/RW 05" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="village">Desa/Kelurahan</Label>
          <Input id="village" name="village" maxLength={100} defaultValue={defaultValues?.village ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">Kecamatan</Label>
          <Input id="district" name="district" maxLength={100} defaultValue={defaultValues?.district ?? ''} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="city">Kota/Kabupaten</Label>
          <Input id="city" name="city" maxLength={100} defaultValue={defaultValues?.city ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">Provinsi</Label>
          <Input id="province" name="province" maxLength={100} defaultValue={defaultValues?.province ?? ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Kode Pos</Label>
        <Input id="postalCode" name="postalCode" maxLength={5} pattern="\d{5}" defaultValue={defaultValues?.postalCode ?? ''} placeholder="Cth: 68118" />
      </div>

      <hr className="border-border" />

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (pisah koma)</Label>
        <Input id="tags" name="tags" defaultValue={defaultValues?.tags?.join(', ') ?? ''} placeholder="Cth: langganan, VIP" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={defaultValues?.notes ?? ''} placeholder="Cth: Suka minta pewangi ekstra" />
      </div>
    </>
  );
}