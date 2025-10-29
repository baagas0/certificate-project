# Cara Menggunakan Background Image pada Sertifikat

## Overview
Sertifikat sekarang mendukung penggunaan gambar background untuk setiap halaman. Fitur ini memungkinkan Anda menambahkan desain khusus pada latar belakang sertifikat dengan ukuran canvas yang otomatis menyesuaikan dengan dimensi background image.

## Cara Menggunakan

### 1. Melalui Halaman Utama (Editor)
1. Buka aplikasi di `http://localhost:3002`
2. Pilih tab **"Halaman"** di sidebar kiri
3. Masukkan URL gambar background di field **"Background Image URL"**
4. Klik **"Apply Background"** untuk menerapkan
5. Background akan langsung muncul dan canvas otomatis menyesuaikan ukuran

### 2. Melalui Halaman Preview
1. Buka halaman preview (`/preview`)
2. Di sidebar kanan, akan muncul pengaturan untuk setiap halaman
3. Masukkan URL gambar dan klik **"Apply Background"**
4. Canvas preview akan otomatis menyesuaikan dengan rasio aspek background

## ✨ Fitur Baru
- 🎯 **Auto-resize Canvas**: Canvas otomatis menyesuaikan rasio aspek dengan background image
- 🖼️ **Real-time Preview**: Preview gambar sebelum apply
- 🔄 **Error Handling**: Pesan error jika gambar gagal dimuat
- 🗑️ **Easy Remove**: Tombol untuk menghapus background
- 👻 **Smart Transparency**: Transparansi otomatis pada komponen (90% opacity)
- 📄 **Multi-page Support**: Setiap halaman dapat memiliki background berbeda

## Format yang Didukukung
- URL gambar (http/https)
- Format: JPG, PNG, GIF, WebP
- Direkomendasikan resolusi tinggi untuk hasil terbaik
- Rasio aspek otomatis disesuaikan (portrait/landscape)

## Cara Kerja Auto-resize Canvas
1. **Default**: Canvas menggunakan rasio 8.5:11 (certificate standard)
2. **Dengan Background**: Canvas otomatis mengadopsi rasio aspek background image
3. **Responsive**: Background menyesuaikan ukuran container dengan `object-cover`
4. **Component Layout**: Komponen tetap pada posisi yang relatif terhadap grid

## Contoh URL Background
```
https://example.com/certificate-background.jpg
https://cdn.example.com/templates/background-1.png
https://picsum.photos/1200/1600  // Contoh background portrait
```

## Troubleshooting
- **Gambar tidak muncul**: Pastikan URL valid dan dapat diakses publik
- **Ukuran besar**: Maksimal 5MB direkomendasikan untuk loading cepat
- **Rasio aspek**: Gunakan gambar dengan rasio yang diinginkan, canvas akan mengikuti
- **CORS error**: Pastikan gambar dapat diakses dari domain yang berbeda
- **Loading lama**: Gunakan gambar yang sudah dioptimalkan untuk web

## Komponen yang Terpengaruh
- `CertificateCanvas.tsx` - Render background dengan auto-resize
- `PagePropertiesPanel.tsx` - Panel pengaturan background
- `certificateStore.ts` - State management background image

## Tips
- Gunakan gambar dengan resolusi tinggi (minimal 1200px width)
- Background dengan gradasi atau pattern akan terlihat lebih baik
- Hindari gambar yang terlalu detail yang dapat mengganggu teks
- Test dengan berbagai ukuran gambar untuk hasil terbaik