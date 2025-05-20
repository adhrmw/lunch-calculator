export function formatIDR(angka: number): string {
    return "Rp" + angka.toLocaleString("id-ID");
  }
  
  export function hitungPembayaran(
    dataOrang: Record<string, number>,
    total: number,
    pengiriman = 0,
    admin = 0,
    diskon = 0
  ) {
    const totalAwal = Object.values(dataOrang).reduce((acc, curr) => acc + curr, 0);
    const totalDibayar = total - diskon + pengiriman + admin;
  
    const hasil = Object.entries(dataOrang).map(([nama, kontribusi]) => {
      const proporsi = kontribusi / totalAwal;
      const bayarSeharusnya = Math.round(proporsi * totalDibayar);
      return { nama, bayarSeharusnya };
    });
  
    return {
      rincian: {
        total,
        diskon,
        pengiriman,
        admin,
        totalDibayar
      },
      hasil
    };
  }
  