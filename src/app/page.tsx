"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { format } from "date-fns";
import { CalendarIcon, Pencil, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

type Orang = {
  nama: string;
  kontribusi: number;
};

export default function Home() {
  const [dataOrang, setDataOrang] = useState<Orang[]>([]);
  const [nama, setNama] = useState("");
  const [namaPembayar, setNamaPembayar] = useState("");
  const [harga, setHarga] = useState("");
  const [pengiriman, setPengiriman] = useState("");
  const [admin, setAdmin] = useState("");
  const [diskon, setDiskon] = useState("");
  const [hasil, setHasil] = useState<{ nama: string; bayar: string }[]>([]);
  const [tanggalPesan, setTanggalPesan] = useState<Date>(new Date());
  const hasilRef = useRef<HTMLDivElement>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const formatHargaInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue) return "";
    return "Rp. " + Number(numericValue).toLocaleString("id-ID");
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove non-digit characters (remove Rp, spaces, dots)
    const cleanValue = inputValue.replace(/[^0-9]/g, "");
    setHarga(cleanValue);
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove non-digit characters (remove Rp, spaces, dots)
    const cleanValue = inputValue.replace(/[^0-9]/g, "");
    setAdmin(cleanValue);
  };

  const handlePengirimanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove non-digit characters (remove Rp, spaces, dots)
    const cleanValue = inputValue.replace(/[^0-9]/g, "");
    setPengiriman(cleanValue);
  };

  const handleDiskonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove non-digit characters (remove Rp, spaces, dots)
    const cleanValue = inputValue.replace(/[^0-9]/g, "");
    setDiskon(cleanValue);
  };

  // Add this function near other utility functions
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Modify where we add new person to capitalize the name
  const tambahOrang = () => {
    if (!nama || !harga) return;
    const kontribusi = parseInt(harga.replace(/\D/g, ""));
    if (isNaN(kontribusi)) return;

    const orangBaru = { nama: capitalize(nama), kontribusi };

    if (editIndex !== null) {
      const update = [...dataOrang];
      update[editIndex] = orangBaru;
      setDataOrang(update);
      setEditIndex(null);
    } else {
      setDataOrang([...dataOrang, orangBaru]);
    }

    setNama("");
    setHarga("");
  };

  const editOrang = (index: number) => {
    const orang = dataOrang[index];
    setNama(orang.nama);
    setHarga(orang.kontribusi.toString());
    setEditIndex(index);
  };

  const hapusOrang = (index: number) => {
    const baru = dataOrang.filter((_, i) => i !== index);
    setDataOrang(baru);
    if (editIndex === index) {
      setNama("");
      setHarga("");
      setEditIndex(null);
    }
  };

  // In the results table, modify the name display
  {hasil.map((item, index) => (
    <TableRow key={index}>
      <TableCell>{item.nama}</TableCell>
      <TableCell className="text-right">{item.bayar}</TableCell>
    </TableRow>
  ))}

  const getTotalKontribusi = () => {
    return dataOrang.reduce((acc, item) => acc + item.kontribusi, 0);
  };

  const hitungPembayaran = () => {
    const totalAwal = getTotalKontribusi();
    const pengirimanInt = parseInt(pengiriman || "0");
    const adminInt = parseInt(admin || "0");
    const diskonInt = parseInt(diskon || "0");

    const totalBayar = totalAwal - diskonInt + pengirimanInt + adminInt;

    const hasilBaru = dataOrang.map((orang) => {
      const proporsi = orang.kontribusi / totalAwal;
      const bayarSeharusnya = Math.round(proporsi * totalBayar);
      return {
        nama: orang.nama,
        bayar: formatIDR(bayarSeharusnya),
      };
    });

    setHasil(hasilBaru);
  };

  const formatIDR = (angka: number) => {
    return `Rp. ${angka.toLocaleString("id-ID")}`;
  };

  // Add reset function after other functions
  const resetAll = () => {
    setDataOrang([]);
    setNama("");
    setHarga("");
    setPengiriman("");
    setAdmin("");
    setDiskon("");
    setHasil([]);
    setNamaPembayar("");
    setTanggalPesan(new Date()); // Reset to current date
  };

  const downloadHasil = async () => {
    if (hasilRef.current === null) return;
    
    const dataUrl = await toPng(hasilRef.current, {
      quality: 0.95,
      backgroundColor: 'white'
    });
    
    const formattedDate = format(tanggalPesan, "ddMMyyyy").toUpperCase();
    const link = document.createElement('a');
    link.download = `${formattedDate}-pembagian-biaya-makan.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">PEMBAGIAN BIAYA MAKAN</h1>
      <div className="border rounded-xl p-4 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold uppercase">pembayar pesanan</h2>
          <Input
            placeholder="Nama yang membayar"
            value={namaPembayar}
            onChange={(e) => setNamaPembayar(e.target.value)}
          />
          <div className="mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !tanggalPesan && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalPesan ? format(tanggalPesan, "PPP") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggalPesan}
                  onSelect={(date) => date && setTanggalPesan(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      
      {/* Form Input Orang */}
      <div className="border rounded-xl p-4 space-y-4 shadow-sm">
        
        <h2 className="text-lg font-semibold uppercase">input pemesan</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tambahOrang();
              }
            }}
          />
          <Input
            placeholder="Harga (mis. 15000)"
            value={formatHargaInput(harga)}
            onChange={handleHargaChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tambahOrang();
              }
            }}
          />
          <Button onClick={tambahOrang}>
            {editIndex !== null ? "Simpan" : "Tambah"}
          </Button>
        </div>

        {/* List of people in table format */}
        {dataOrang.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 uppercase">daftar pemesan</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Kontribusi</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataOrang.map((orang, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-10">{index + 1}</TableCell>
                    <TableCell>{orang.nama}</TableCell>
                    <TableCell className="text-right">{formatIDR(orang.kontribusi)}</TableCell>
                    <TableCell className="text-center w-32 space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => editOrang(index)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => hapusOrang(index)}
                        aria-label="Hapus"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Input Detail Biaya */}
      <div className="border rounded-xl p-4 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold uppercase">detail biaya</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted p-4 rounded-lg w-full">
            <span className="text-sm font-medium uppercase">total pesanan</span>
            <span className="text-lg font-semibold">{formatIDR(getTotalKontribusi())}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              placeholder="Biaya Pengiriman"
              value={formatHargaInput(pengiriman)}
              onChange={handlePengirimanChange}
            />
            <Input
              placeholder="Biaya Admin"
              value={formatHargaInput(admin)}
              onChange={handleAdminChange}
            />
            <Input
              placeholder="Diskon"
              value={formatHargaInput(diskon)}
              onChange={handleDiskonChange}
            />
          </div>
        </div>

        {/* Modify the button section in Detail Biaya */}
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={hitungPembayaran}
          >
            Hitung Pembayaran
          </Button>
          <Button 
            variant="destructive" 
            onClick={resetAll}
          >
            Reset
          </Button>
        </div>
        <div>
        {/* <Button onClick={sendTelegramMessage}>
          Kirim ke Telegram
        </Button> */}
        </div>
      </div>

      {/* Tabel Hasil */}
      {hasil.length > 0 && (
        <div ref={hasilRef} className="border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold uppercase">hasil pembagian</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadHasil}
              className="text-xs"
            >
              Download
            </Button>
          </div>
          <div className="space-y-4">
          <div className="flex justify-between items-center text-sm mb-4">
            <div>
              {format(tanggalPesan, "PPP")}
            </div>
            {namaPembayar && (
              <div className="font-regular">
                Pembayaran ke <span className="font-semibold">{capitalize(namaPembayar)}</span>
              </div>
            )}
          </div>
            <div className="flex items-center justify-between bg-muted p-4 rounded-lg w-full">
              
              <div className="w-full space-y-1">
                <div className="w-full flex justify-between text-sm">
                  <span>Total Pesanan</span>
                  <span className="ml-auto">{formatIDR(getTotalKontribusi())}</span>
                </div>
                {pengiriman && (
                  <div className="w-full flex justify-between text-sm">
                    <span>Biaya Pengiriman</span>
                    <span className="ml-auto">{formatIDR(parseInt(pengiriman))}</span>
                  </div>
                )}
                {admin && (
                  <div className="w-full flex justify-between text-sm">
                    <span>Biaya Admin</span>
                    <span className="ml-auto">{formatIDR(parseInt(admin))}</span>
                  </div>
                )}
                {diskon && (
                  <div className="w-full flex justify-between text-sm">
                    <span>Diskon</span>
                    <span className="ml-auto">{formatIDR(parseInt(diskon))}</span>
                  </div>
                )}
                <div className="w-full flex justify-between border-t mt-2 pt-2">
                  <span className="font-medium uppercase">total akhir</span>
                  <span className="ml-auto text-lg font-semibold">
                    {formatIDR(getTotalKontribusi() + parseInt(pengiriman || "0") + parseInt(admin || "0") - parseInt(diskon || "0"))}
                  </span>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-right">Harus Bayar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasil.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell className="text-right">{item.bayar}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>     
        </div>
      )}
      <Footer />
    </div>
  );
}
