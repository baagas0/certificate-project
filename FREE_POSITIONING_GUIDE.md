# Cara Menggunakan Free Positioning pada Sertifikat

## Overview
Sertifikat sekarang mendukung **dua mode positioning** untuk komponen:
1. **Grid Mode** - Posisi berdasarkan grid (default)
2. **Free Mode** - Posisi bebas dengan drag-and-drop (pixel-based)

## 🎯 Fitur Utama

### Grid Mode (Default)
- Komponen diatur dalam grid 12x12
- Mudah untuk alignment yang rapi
- Cocok untuk layout terstruktur

### Free Mode
- Drag-and-drop bebas di mana saja
- Posisi presisi dalam pixel
- Flexible untuk desain kreatif

## 🚀 Cara Menggunakan

### 1. Mengubah Mode Positioning

#### Dari Grid ke Free Mode:
1. **Pilih komponen** yang ingin diubah
2. **Klik tombol "Free"** (biru) di pojok kanan atas komponen
3. Komponen akan otomatis konversi ke free positioning
4. **Drag komponen** ke posisi yang diinginkan

#### Dari Free ke Grid Mode:
1. **Pilih komponen free positioning**
2. **Klik tombol "Grid"** (hijau) di pojok kanan atas
3. Posisi akan dikonversi kembali ke grid terdekat

### 2. Menggunakan Free Positioning

#### Drag and Drop:
1. **Klik dan tahan** pada komponen free positioning
2. **Seret** ke posisi yang diinginkan
3. **Lepaskan** untuk menempatkan komponen

#### Visual Indicators:
- **Kursor**: 🖐️ `cursor-grab` saat hover, ✊ `cursor-grabbing` saat drag
- **Border**: 🔵 Biru untuk komponen terpilih, 🔘 Abu-abu untuk normal
- **Tombol**: 🔵 "Free" untuk grid mode, 🟢 "Grid" untuk free mode

## 🔧 Detail Teknis

### Grid Mode Properties:
```typescript
interface ComponentLayout {
  x: number;     // Grid column (0-11)
  y: number;     // Grid row (0-11)
  w: number;     // Width in grid units
  h: number;     // Height in grid units
  positionMode: 'grid';
}
```

### Free Mode Properties:
```typescript
interface ComponentLayout {
  left: number;    // X position in pixels
  top: number;     // Y position in pixels
  width: number;   // Width in pixels
  height: number;  // Height in pixels
  positionMode: 'free';
}
```

### Konversi Otomatis:
- **Grid → Free**: Konversi grid ke pixel berdasarkan canvas size (750px width)
- **Free → Grid**: Posisi dipetakan ke grid terdekat

## 🎨 Tips & Best Practices

### Untuk Layout Terstruktur:
- Gunakan **Grid Mode** untuk header, footer, dan elemen yang sejajar
- Mudah maintain consistency antar halaman

### Untuk Desain Kreatif:
- Gunakan **Free Mode** untuk elemen dekoratif, watermark, atau posisi unik
- Lebih fleksible untuk desain artistic

### Mixed Approach:
- Kombinasikan **kedua mode** dalam satu sertifikat
- Gunakan grid untuk struktur utama, free untuk aksen

## 📝 Cara Kerja Drag and Drop

1. **Mouse Down**: Detect drag start pada komponen free mode
2. **Mouse Move**: Update posisi real-time saat drag
3. **Mouse Up**: Finalisasi posisi dan update state
4. **Boundary Check**: Komponen tidak bisa keluar dari canvas area

## 🔄 State Management

- **Zustand Store**: Menyimpan position mode dan koordinat
- **Real-time Update**: Posisi langsung tersimpan saat drag
- **Persistence**: Mode dan posisi tersimpan dalam template

## 🎯 Use Cases

### Grid Mode Cocok Untuk:
- Nama peserta
- Tanggal sertifikat
- Tanda tangan
- Judul utama
- Informasi standar

### Free Mode Cocok Untuk:
- Logo atau watermark
- Decorative elements
- Background text
- Stamp atau seal
- Elemen desain khusus

## ⚠️ Limitations

- Free positioning hanya available di **editing mode**
- Di preview mode, komponen tetap di posisi yang diset
- Export PDF menggunakan posisi yang sudah disimpan
- Resize hanya available di grid mode

## 🚀 Quick Start

1. **Buka aplikasi** di `http://localhost:3002`
2. **Tambah komponen** melalui Component Library
3. **Klik "Free"** pada komponen untuk mengaktifkan free positioning
4. **Drag komponen** ke posisi yang diinginkan
5. **Klik "Grid"** untuk kembali ke grid mode

## 🔍 Troubleshooting

**Komponen tidak bisa drag?**
- Pastikan di editing mode
- Pastikan komponen dalam free mode
- Coba refresh halaman

**Posisi tidak tersimpan?**
- Pastikan drag selesai sebelum save/generate PDF
- Check console untuk error message

**Tombol mode tidak muncul?**
- Pastikan editing mode aktif
- Pastikan komponen terpilih

Sekarang Anda memiliki kontrol penuh atas positioning komponen sertifikat! 🎉