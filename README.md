# Arutala Persona Agent

> Merayakan keberagaman bahasa Indonesia melalui 21 persona AI unik — dari Bahasa Formal hingga Basa Using Banyuwangi.

**Part of [Arutala Aksara](https://www.arutalaaksara.com) ecosystem**

## 📁 Struktur File

```
persona-agent/
├── index.html          # Halaman utama - daftar semua persona
├── chatbot.html        # Halaman chat - coba persona interaktif
├── about.html          # Halaman about - informasi lengkap
├── styles.css          # Semua styling dan animasi
├── data.js            # Data 21 persona
├── app.js             # Logic aplikasi
└── README.md          # Dokumentasi ini
```

## 🎯 Fitur

- **21 Persona** dengan karakter unik
- **4 Kategori**: Bahasa Indonesia, Jawa, Campuran, Sunda
- **Interactive Chat** untuk mencoba setiap persona
- **About Page** dengan informasi lengkap
- **Animasi Smooth** dengan intersection observer
- **Responsive Design** untuk semua ukuran layar
- **Modal Interaktif** untuk detail persona
- **SVG Character** yang di-generate dinamis
- **Arutala Branding** sesuai identitas Arutala Aksara

## 🚀 Cara Menggunakan

1. Buka `index.html` di browser untuk melihat semua persona
2. Klik "Try Chat" atau buka `chatbot.html` untuk mencoba chat dengan persona
3. Klik "About" atau buka `about.html` untuk informasi lengkap
4. Scroll untuk melihat semua persona di halaman utama
5. Klik card untuk melihat detail persona
6. Tekan `ESC` untuk menutup modal

## 🎨 Branding Arutala

Website ini menggunakan identitas visual Arutala Aksara:
- **Warna Primary**: `#0891b2` (Teal/Cyan)
- **Warna Secondary**: `#0284c7` (Blue)
- **Warna Accent**: `#14b8a6` (Teal Light)
- **No Gradients**: Solid colors untuk konsistensi brand
- **Clean & Modern**: Design yang profesional dan mudah digunakan

## 💻 Teknologi

- **HTML5** - Struktur semantic
- **CSS3** - Custom properties, Grid, Flexbox, Animations
- **Vanilla JavaScript** - Tanpa dependencies
- **SVG** - Ilustrasi karakter dinamis

## 📦 File Details

### `index.html`
File HTML utama yang mengatur struktur halaman. Clean dan semantic.

### `styles.css`
Semua styling terorganisir dengan baik:
- CSS Variables untuk tema
- Grid layout untuk cards
- Animasi smooth
- Responsive breakpoints
- Modal styling

### `data.js`
Berisi object `personas` dengan 21 data persona:
```javascript
const personas = {
  1: {
    name: "...",
    region: "...",
    icon: "...",
    color: ["#...", "#..."],
    desc: "...",
    sample: "..."
  },
  // ... 20 lainnya
}
```

### `app.js`
Logic aplikasi yang terorganisir:
- `renderPersonas()` - Render semua cards
- `openModal()` - Buka detail persona
- `closeModal()` - Tutup modal
- `generateCharacterSVG()` - Generate karakter SVG
- `initScrollAnimations()` - Setup scroll animations
- `init()` - Initialize app

## 🎨 Customization

### Menambah Persona Baru
Edit `data.js`:
```javascript
22: {
  name: "Nama Persona",
  region: "Daerah",
  icon: "🎭",
  color: ["#hexcolor1", "#hexcolor2"],
  desc: "Deskripsi...",
  sample: "Contoh bicara..."
}
```

Update mapping di `app.js`:
```javascript
const colorMap = {
  // ... tambahkan:
  22: 'purple'
};

const sectionMap = {
  // ... tambahkan:
  22: 1  // nomor section (1-4)
};
```

### Mengubah Warna Tema
Edit CSS variables di `styles.css`:
```css
:root {
  --purple: #a855f7;
  --pink: #ec4899;
  /* ... dll */
}
```

## 📱 Responsive

- **Desktop**: 4 kolom grid
- **Tablet**: 2-3 kolom grid
- **Mobile**: 1 kolom stack

## ⚡ Performance

- Lazy loading dengan Intersection Observer
- CSS animations dengan GPU acceleration
- Minimal JavaScript dependencies
- Efficient DOM manipulation

## 🛠️ Development

Tidak ada build process! Langsung buka di browser:
```bash
open index.html
```

Atau gunakan simple server:
```bash
python -m http.server 8000
# atau
npx serve
```

## 📄 License

Free to use untuk project personal maupun komersial.

---

**Dibuat dengan ❤️ untuk Indonesia yang kaya akan budaya dan bahasa.**
