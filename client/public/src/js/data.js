// Persona Data
  const personas = {
    1: {
      name: "Formal / Resmi",
      region: "Bahasa Indonesia Baku",
      icon: "💼",
      color: ["#6366f1","#a855f7"],
      desc: "Persona ini menggunakan tata bahasa Indonesia yang baku, sesuai EYD, dan sangat cocok untuk konteks profesional. Setiap kata dipilih dengan cermat, struktur kalimat lengkap, dan tidak ada singkatan informal.",
      sample: "Selamat siang, dengan hormat saya ingin menyampaikan bahwa laporan tersebut telah selesai dikerjakan sesuai tenggat waktu yang ditetapkan."
    },
    2: {
      name: "Jaksel",
      region: "Jakarta Selatan Urban",
      icon: "☕",
      color: ["#a855f7","#ec4899"],
      desc: "Persona khas South Jakarta yang trendy — campuran Indonesia-English yang fluid. Which is why ini literally udah jadi bahasa tersendiri buat anak-anak urban Jakarta yang vibe-nya aesthetic dan sophisticated.",
      sample: "Honestly sih aku setuju, which is why tadi aku literally bilang ke dia bahwa this whole thing is lowkey unfair. Anyway, let's grab coffee dulu!"
    },
    3: {
      name: "Non-Baku Harian",
      region: "Bahasa Indonesia Sehari-hari",
      icon: "💬",
      color: ["#06b6d4","#10b981"],
      desc: "Bahasa santai yang dipakai sehari-hari oleh kebanyakan orang Indonesia. Penuh singkatan (gw, lo, gak, udah), imbuhan khas (sih, dong, kok, lah), dan terasa natural banget buat ngobrol sama teman.",
      sample: "Eh lo udah makan belum? Ayo dong kita makan bareng, aku lagi laper banget nih. Mau ke mana emangnya sekarang?"
    },
    4: {
      name: "Gen Z Viral",
      region: "TikTok / Bahasa Gaul",
      icon: "🔥",
      color: ["#ec4899","#f97316"],
      desc: "Bahasa Gen Z Indonesia yang penuh slang viral dari TikTok dan media sosial. Campuran kata-kata English yang di-twist, istilah internet, dan ekspresi yang hyperbolic. No cap, ini rizz banget!",
      sample: "Bestie, ini literally red flag banget sih. Skibidi rizz-nya ilang gitu aja? Main character era kita udah expired? Nah gaslight period is OVER bestie!"
    },
    5: {
      name: "Gen Alpha Brainrot",
      region: "Internet Culture / Gaming",
      icon: "🎮",
      color: ["#8b5cf6","#06b6d4"],
      desc: "Bahasa Gen Alpha yang penuh referensi internet dan gaming. Kata-kata seperti 'sigma', 'Ohio', 'rizz', 'sussy', dicampur dengan referensi game dan meme. Chat is this real?!",
      sample: "Bro this AI is so sigma, no cap. Ohio moment detected, sussy amogus behavior. W interaction, definitely not L. Minecraft Steve would be proud fr fr."
    },
    6: {
      name: "Corporate",
      region: "Bahasa Indonesia Bisnis",
      icon: "📊",
      color: ["#1e40af","#6366f1"],
      desc: "Bahasa profesional dunia korporat Indonesia. Penuh jargon bisnis, terstruktur, dan berorientasi hasil. Action item, deliverable, stakeholder, KPI, dan synergy adalah kosakata harian. Cocok untuk presentasi direksi dan email C-suite.",
      sample: "Mengacu pada diskusi sebelumnya, kami perlu melakukan alignment terlebih dahulu terkait roadmap Q3. Mari kita schedule quick sync untuk mereview key metrics dan memastikan semua stakeholder on the same page."
    },
    7: {
      name: "Ilmiah",
      region: "Bahasa Indonesia Akademik",
      icon: "🔬",
      color: ["#78716c","#0ea5e9"],
      desc: "Bahasa tulis akademik yang mengikuti kaidah ilmiah ketat. Menggunakan kalimat pasif, penomoran yang teratur, sitasi, dan terminologi ilmiah. Digunakan untuk jurnal, skripsi, tesis, disertasi, dan makalah ilmiah.",
      sample: "Berdasarkan hasil analisis data yang telah dilakukan, dapat disimpulkan bahwa terdapat korelasi signifikan (p<0.05) antara variabel independen dengan variabel dependen sebagaimana dipaparkan pada Tabel 3.2 di atas."
    },
    8: {
      name: "Jurnalistik",
      region: "Bahasa Indonesia Media",
      icon: "📰",
      color: ["#475569","#14b8a6"],
      desc: "Bahasa berita yang mengikuti kaidah jurnalistik: lugas, aktif, piramida terbalik, dan objektif. Kalimat pendek dan padat. Menghindari opini yang tidak berdasar. Gaya jurnalisme cetak dan digital profesional Indonesia.",
      sample: "Jakarta, Kamis — Pemerintah mengumumkan kebijakan baru terkait subsidi energi yang akan berlaku mulai bulan depan. Kebijakan tersebut diperkirakan berdampak pada jutaan warga di seluruh Indonesia."
    },
    9: {
      name: "Mataraman",
      region: "Solo / Yogyakarta Halus",
      icon: "🗡️",
      color: ["#f59e0b","#84cc16"],
      desc: "Bahasa Jawa Kromo Alus khas Solo-Jogja yang penuh unggah-ungguh. Sopan, halus, dan sarat dengan filosofi Jawa. Setiap kata mencerminkan budaya tinggi dan kebijaksanaan leluhur Mataram.",
      sample: "Kulo nuwun, menawi panjenengan kersa rawuh wonten ing griya kulo, kulo aturi lenggah rumiyin. Wonten pundi anggen panjenengan badhe tindak?"
    },
    10: {
      name: "Suroboyoan",
      region: "Surabaya Blak-blakan",
      icon: "🦈",
      color: ["#ef4444","#f97316"],
      desc: "Dialek Surabaya yang blak-blakan, keras, tapi penuh kehangatan. Kata 'rek', 'cak', 'ayo' adalah ciri khasnya. Bicara langsung ke inti, gak bertele-tele, tapi sesungguhnya sangat loyal.",
      sample: "Rek, ayo cak! Awakmu arep neng endi se? Gak usah mbulet-mbulet, ngomongo langsung ae. Suroboyo yo ngono iku, jujur, berani!"
    },
    11: {
      name: "Ngapak",
      region: "Banyumas / Purwokerto",
      icon: "🌾",
      color: ["#10b981","#06b6d4"],
      desc: "Dialek Banyumasan (Ngapak) yang ekspresif dan penuh semangat. Ciri khas: pengucapan vokal yang 'mbledos', kata-kata seperti 'kiye', 'rika', 'inyong'. Jujur, lugas, dan mengundang tawa!",
      sample: "Heh inyong karo rika kudu ngomong sing bener ya kiye! Rika arep neng ngendi bae, kiye wis bengi lho. Ayo mangan sik, wetengku wis koclak-koclak!"
    },
    12: {
      name: "Kediri",
      region: "Jawa Timur Mantap",
      icon: "🏔️",
      color: ["#64748b","#06b6d4"],
      desc: "Dialek Kediri yang tegas, lugas, dan penuh keyakinan. Mirip Suroboyoan tapi lebih kalem. Ngomong apa adanya, gak basa-basi berlebih, tapi tetap respectful dan warm.",
      sample: "Wes lah, ngomong opo adane ae. Awakmu ngerti kan maksudku opo? Ora usah diomongke panjang lebar, intinya kita harus gerak cepat wes."
    },
    13: {
      name: "Kedu",
      region: "Jawa Tengah Adem",
      icon: "🛕",
      color: ["#14b8a6","#6366f1"],
      desc: "Dialek Kedu (Magelang, Temanggung) yang tenang dan penuh filosofi. Ngomong pelan, hati-hati, penuh makna. Sering mengandung ungkapan bijak dan perumpamaan dari kearifan lokal.",
      sample: "Nggih, kula mangertos. Tiyang gesang iku kudu sareh, ora usah kesusu. Iling, rejeki iku wis ana sing ngrumat, sing penting kita mlayu ojo tiba."
    },
    14: {
      name: "Semarangan",
      region: "Semarang Ndêlik-Ndêlik",
      icon: "🏮",
      color: ["#b45309","#f97316"],
      desc: "Dialek Jawa Semarang yang khas — perpaduan Jawa, pengaruh Cina Peranakan Semarang, dan budaya pesisir. Santai, hangat, penuh humor, dan sering memakai kata-kata khas 'Semawis' yang tidak ada di Jawa standar.",
      sample: "Wah, iyo to cah, kiye pancen enak banget! Ayo neng Simpang Lima sik, nongkrong-nongkrong dhisit. Wong Semarang mah santai ae, ora usah sepaneng!"
    },
    15: {
      name: "Ngapak Pantura",
      region: "Pesisir Utara Jawa",
      icon: "🌊",
      color: ["#15803d","#84cc16"],
      desc: "Ngapak versi pesisir utara Jawa — lebih keras, lebih cepat, dan terpengaruh budaya pelabuhan serta Cirebon. Lebih 'mbledos' dan vokal dari Ngapak pedalaman. Jiwa nelayan dan pedagang pesisir terasa kental.",
      sample: "Kiya rika mau lungo apa ora? Ayo blayu ae, ora usah nunggu suwi! Pantura mah cepet, gamleng, ora tau males-malesan. Ayo mangkat bareng!"
    },
    16: {
      name: "Osing",
      region: "Banyuwangi Jenggirat",
      icon: "🌺",
      color: ["#0369a1","#06b6d4"],
      desc: "Basa Using — dialek Jawa paling timur yang sangat unik. Berbeda dari Jawa standar maupun Jawa Timuran pada umumnya, dengan kosakata yang kadang mirip Bali. Identitas Banyuwangi yang bangga dan kaya seni Gandrung.",
      sample: "Siro arep lungo nang ngendi? Ingsun melu siro yo, ayo bebarengan ae. Osing mah ora kalah karo sopo-sopo, sugih budaya, sugih seni, sing penting sesarengan!"
    },
    17: {
      name: "Indo-Jawa Mixed",
      region: "Bahasa Campur Halus",
      icon: "🤝",
      color: ["#06b6d4","#10b981"],
      desc: "Percampuran alami antara Bahasa Indonesia dan Jawa yang biasa terjadi di lingkungan semi-formal di Jawa. Kata Indonesia sebagai base, dengan sisipan Jawa yang terasa natural dan tidak dipaksakan.",
      sample: "Iya, ayo kita rembukan bareng dulu, ben ada mufakat. Saya rasa perlu kita duduk bersama, ngobrol santai, supaya masalah iki bisa kelar."
    },
    18: {
      name: "Jawa-Indonesia",
      region: "Lokal tapi Nasionalis",
      icon: "🚩",
      color: ["#f43f5e","#a855f7"],
      desc: "Bahasa Jawa sebagai base utama, tapi dengan sentuhan kebanggaan nasional yang kuat. Identitas lokal Jawa tetap kuat, tapi rasa cinta tanah air Indonesia juga sangat terasa.",
      sample: "Ayo cah, kita kudu bangga dadi wong Jawa sekaligus wong Indonesia. Loro-lorone iku ora beda, malah saling ngekuatne siji lan sijine."
    },
    19: {
      name: "Sunda Parahyangan",
      region: "Bandung / Priangan Aesthetic",
      icon: "🎋",
      color: ["#84cc16","#10b981"],
      desc: "Bahasa Sunda halus khas Bandung-Priangan. Lemes, melodis, dan penuh kasopanan. Urang Bandung terkenal dengan keramahan, cara bicara yang estetik, dan kebanggaan sebagai 'Paris van Java'. Nyunda pisan!",
      sample: "Wilujeng sumping ka Bandung! Kumaha damang? Mangga calik heula, urang ngobrol bari nginum kopi Priangan. Sunda mah kacida someah ka nu datang tea."
    },
    20: {
      name: "Sunda Banten",
      region: "Banten Jawara",
      icon: "⚔️",
      color: ["#dc2626","#f59e0b"],
      desc: "Bahasa Sunda Banten yang tegas dan penuh jiwa Jawara. Berbeda dengan Sunda Bandung yang lembut, Sunda Banten lebih keras, berani, dan tidak gentar. Warisan tradisi Pencak Silat dan debus membentuk karakternya.",
      sample: "Urang Banten mah moal mundur! Basa Sunda Banten kitu — langsung, wani, teu sieun. Sing hayang ngajajal, ayo! Jawara Banten tara kakalahan!"
    },
    21: {
      name: "Cirebonan",
      region: "Cirebon / Brebes Fusion",
      icon: "☁️",
      color: ["#0ea5e9","#6366f1"],
      desc: "Bahasa unik campuran Sunda-Jawa khas Cirebon dan Brebes. Ekspresif, hangat, dan sangat adaptif karena berada di perbatasan dua budaya besar. Mega Mendung bukan cuma motif batik — tapi juga cerminan jiwa yang dinamis.",
      sample: "Bray, arek neng mana kiye? Melu inyong ae atuh, urang bareng-bareng. Di Cirebon mah bisa basa Sunda bisa basa Jawa, bebas ae sing penting ngarti!"
    }
  };
