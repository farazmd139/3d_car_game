const surahNames = [
    "Al-Fatihah", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Maidah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
    "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Yasin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
    "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahana",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
    "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
    "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
    "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

// Generate Menu Boxes
let menuHtml = '';
surahNames.forEach((name, index) => {
    const surahNumber = index + 1;
    const gradientClass = `menu-box-${(index % 8) + 1}`; // Cycle through 8 gradients
    menuHtml += `<div class="menu-box ${gradientClass}" onclick="showPage('surah${surahNumber}Page')"><div id="surah${surahNumber}-title" class="menu-title">Surah ${name}</div></div>`;
});

// Generate Surah Pages
let pagesHtml = '';
surahNames.forEach((name, index) => {
    const surahNumber = index + 1;
    const audioSrc = `https://download.quranicaudio.com/quran/abdul_basit_murattal/${String(surahNumber).padStart(3, '0')}.mp3`;
    pagesHtml += `
        <div id="surah${surahNumber}Page" class="surah-page">
            <button class="back-button" onclick="showHomeScreen()">⇦ Home</button>
            <header class="header">
                <h1>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
                <h1>Surah ${name}</h1>
            </header>
            <div class="audio-player-wrapper">
                <div class="custom-audio-player" data-audio-src="${audioSrc}"></div>
            </div>
            <main class="surah-container"></main>
        </div>`;
});

// Insert into HTML
document.querySelector('.menu-container').innerHTML = menuHtml;
document.body.insertAdjacentHTML('beforeend', pagesHtml);
