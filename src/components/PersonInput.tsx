"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PersonInputProps = {
  onAdd: (nama: string, kontribusi: number) => void;
};

export default function PersonInput({ onAdd }: PersonInputProps) {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  const handleAdd = () => {
    const kontribusi = parseInt(harga.replace(/\D/g, ""));
    if (!nama || isNaN(kontribusi)) return;

    onAdd(nama, kontribusi);
    setNama("");
    setHarga("");
  };

  return (
    <div className="flex gap-2 items-end">
      <Input
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <Input
        placeholder="Harga (mis. 15000)"
        value={harga}
        onChange={(e) => setHarga(e.target.value)}
      />
      <Button onClick={handleAdd}>Tambah</Button>
    </div>
  );
}
